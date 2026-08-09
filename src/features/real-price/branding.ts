export type BrandConfig = {
  companyName: string;
  branchName: string;
  agentName: string;
  phone: string;
  address: string;
  logo: string;
  qrCode: string;
  primaryColor: string;
  secondaryColor: string;
  companyLogo: string;
  agentAvatar: string;
  brandMessage: string;
  footerText: string;
};

export type ProposalBranding = BrandConfig;

export const mockBranding: BrandConfig = {
  companyName:'E.X Realty Data Tools',
  branchName:'E.X 示範分店',
  agentName:'E.X 示範顧問',
  phone:'000-000-0000',
  address:'展示資料地址，非真實營業據點',
  logo:'EX',
  qrCode:'MOCK QR',
  primaryColor:'#7ea7ff',
  secondaryColor:'#f4c96a',
  companyLogo:'EX',
  agentAvatar:'EA',
  brandMessage:'以清楚數據，協助客戶理解市場選擇。',
  footerText:'本資料為 Mock Data 展示，不代表正式實價登錄或估價建議。',
};
