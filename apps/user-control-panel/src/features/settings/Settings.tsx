import TelegramSettingsGroup from "./components/service-groups/TelegramSettingsGroup";
import EmailSettingsGroup from './components/service-groups/EmailSettingsGroup'
import DiscordSettingsGroup from "./components/service-groups/DiscordSettingsGroup";
import SlackSettingsGroup from "./components/service-groups/SlackSettingsGroup";
import SmsTwilioSettingsGroup from "./components/service-groups/SmsTwilioSettingsGroup";
import OneSignalSettingsGroup from "./components/service-groups/OneSignalSettingsGroup";
import WhatsappBusinessSettingsGroup from "./components/service-groups/WhatsappBusinessSettingsGroup";
import BinanceSettingsGroup from "./components/service-groups/BinanceSettingsGroup";
import BybitSettingsGroup from "./components/service-groups/BybitSettingsGroup";
import KrakenSettingsGroup from "./components/service-groups/KrakenSettingsGroup";
import WebhooksSettingsGroup from "./components/service-groups/WebhooksSettingsGroup";
import { PAGE, PAGE_LEAD, PAGE_TITLE } from "../../shared/ui/styles";

export default function Settings() {
  return (
    <div className={PAGE}>
      <h1 className={PAGE_TITLE}>Rules Settings</h1>
      <p className={`${PAGE_LEAD} mb-8`}>
        Connect your exchanges and the channels where your rules notify you.
      </p>
      <div className="flex flex-col gap-3">
        <TelegramSettingsGroup />
        <EmailSettingsGroup />
        <DiscordSettingsGroup />
        <SlackSettingsGroup />
        <SmsTwilioSettingsGroup />
        <OneSignalSettingsGroup />
        <WhatsappBusinessSettingsGroup />
        <BinanceSettingsGroup />
        <BybitSettingsGroup />
        <KrakenSettingsGroup />
        <WebhooksSettingsGroup/>
      </div>
    </div>
  );
}