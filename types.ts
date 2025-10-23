export type Message = {
  role: 'user' | 'model';
  text: string;
};

export type UserPreferences = {
  website: string;
  answerType: 'detailed' | 'step-by-step';
};

export enum WebsiteOption {
    ANY = "Any Website",
    FAMILY_SEARCH = "FamilySearch.org",
    ANCESTRY = "Ancestry.com",
    MY_HERITAGE = "MyHeritage",
    FIND_MY_PAST = "Findmypast",
    US_NATIONAL_ARCHIVES = "US National Archives",
    OTHER = "Other"
}

export enum AnswerTypeOption {
    DETAILED = "detailed",
    STEP_BY_STEP = "step-by-step"
}