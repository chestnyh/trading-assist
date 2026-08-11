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

export default function Settings() {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
      <h1 className="text-h4 text-primary mb-6">Rules Settings</h1>
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
      </div>
    </div>
  );
}