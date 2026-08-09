export type PropertyMarketingContext = {
  propertyName: string;
  propertySummary: string;
  targetAudience: string;
  sellingPoints: string[];
  locationHighlights: string;
  priceHighlights: string;
  callToAction: string;
  keywords: string[];
  source: 'MOCK';
};

export type MarketingContentItem = {title:string;subtitle?:string;body:string;sellingPoints:string[];callToAction:string;};

export type PropertyMarketingContent = {
  listing591: MarketingContentItem;
  facebook: MarketingContentItem;
  instagram: MarketingContentItem;
  line: MarketingContentItem;
  tvWall: MarketingContentItem;
  source: 'MOCK';
};

export type PropertyCreativeContext = {
  propertyName: string;
  imagePrompt: string;
  visualStyle: string;
  sceneSuggestions: string[];
  videoConcept: string;
  source: 'MOCK';
};
