import { EmailIcon } from "outline-icons";
import type { MouseEvent } from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Pagination } from "@shared/constants";
import type Group from "~/models/Group";
import type GroupUser from "~/models/GroupUser";
import NudeButton from "~/components/NudeButton";
import usePolicy from "~/hooks/usePolicy";
import useStores from "~/hooks/useStores";

const GMAIL_COMPOSE_URL_MAX_LENGTH = 7500;

interface Props {
  /** The group whose members should be emailed. */
  group: Group;
}

/**
 * A button that opens Gmail with all members of a group as recipients.
 *
 * @param props - the component props.
 * @returns the email group button.
 */
export function EmailGroupButton({ group }: Props) {
  const { t } = useTranslation();
  const { groupUsers } = useStores();
  const can = usePolicy(group);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailGroup = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Open synchronously before awaiting the API request to avoid popup blockers.
      const composeWindow = window.open("about:blank", "_blank");

      if (composeWindow) {
        composeWindow.opener = null;
      }

      setIsLoading(true);

      try {
        const memberships = await groupUsers.fetchAll({
          id: group.id,
          limit: Pagination.maxLimit,
        });
        const emailAddresses = getEmailAddresses(memberships);

        if (!emailAddresses.length) {
          closeWindow(composeWindow);
          toast.error(t("This group has no email addresses"));
          return;
        }

        const gmailUrl = buildGmailComposeUrl(emailAddresses);

        if (gmailUrl.length > GMAIL_COMPOSE_URL_MAX_LENGTH) {
          closeWindow(composeWindow);
          const didCopy = await copyEmailAddresses(emailAddresses);

          if (didCopy) {
            toast.success(t("Email addresses copied to clipboard"));
          } else {
            toast.error(t("Could not copy email addresses"));
          }

          return;
        }

        if (composeWindow) {
          composeWindow.location.href = gmailUrl;
          return;
        }

        const openedWindow = window.open(gmailUrl, "_blank");

        if (openedWindow) {
          openedWindow.opener = null;
        } else {
          toast.error(t("Could not open Gmail"));
        }
      } catch (err) {
        closeWindow(composeWindow);
        toast.error(
          err instanceof Error ? err.message : t("Could not load group members")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [t, group.id, groupUsers]
  );

  if (!can.read) {
    return null;
  }

  return (
    <NudeButton
      type="button"
      aria-label={t("Email group")}
      disabled={isLoading}
      onClick={handleEmailGroup}
      tooltip={{ content: t("Email group") }}
    >
      <EmailIcon />
    </NudeButton>
  );
}

function getEmailAddresses(memberships: GroupUser[]) {
  const emailAddresses = new Set<string>();

  memberships.forEach((membership) => {
    const email = membership.user.email;

    if (email) {
      emailAddresses.add(email);
    }
  });

  return Array.from(emailAddresses);
}

function buildGmailComposeUrl(emailAddresses: string[]) {
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", emailAddresses.join(","));
  return url.toString();
}

async function copyEmailAddresses(emailAddresses: string[]) {
  if (!navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(emailAddresses.join(", "));
    return true;
  } catch {
    return false;
  }
}

function closeWindow(openedWindow: Window | null) {
  openedWindow?.close();
}
