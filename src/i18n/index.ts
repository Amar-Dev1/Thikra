import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import ar from "@/src/i18n/translations/ar.json";
import en from "@/src/i18n/translations/en.json";

const i18n = new I18n({ en, ar });

// Set the locale once at the beginning of your app.
i18n.locale = getLocales().at(0)?.languageCode ?? "en";
i18n.enableFallback = true;

export default i18n;