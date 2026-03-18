export interface SocialLink {
  name: string;
  icon: string; // Icon adı string olarak
  href: string;
}

export interface ContactData {
  email: string;
  phone?: string;
  location?: string;
  cvPath: string;
  projectsPath: string;
  socialLinks: SocialLink[];
}

import data from "./contacts.json";

export const contactData: ContactData = data as ContactData;
