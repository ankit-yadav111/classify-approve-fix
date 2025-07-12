export interface ClassificationRow {
  id: number;
  subject: string;
  category_1: string;
  score_1: number;
  category_2: string;
  score_2: number;
  is_approved: number;
}

const emailSubjects = [
  "Urgent: Payment Required for Account Verification",
  "Limited Time Offer: 50% Off Premium Subscription",
  "Weekly Newsletter: Industry Updates and Trends",
  "Meeting Invitation: Quarterly Review Discussion",
  "Security Alert: Suspicious Login Attempt Detected",
  "Invoice #INV-2024-001: Payment Due Tomorrow",
  "Welcome to Our Platform: Get Started Guide",
  "Password Reset Request for Your Account",
  "System Maintenance Scheduled for This Weekend",
  "Customer Feedback: Product Review Request",
  "Promotional Code: Exclusive Discount Inside",
  "Account Statement: March 2024 Summary",
  "Technical Support: Ticket #12345 Update",
  "Event Invitation: Annual Tech Conference 2024",
  "Subscription Renewal Notice: Action Required",
  "Marketing Campaign: New Product Launch",
  "Survey Request: Help Us Improve Our Service",
  "Order Confirmation: Your Purchase #ORD-789",
  "Security Update: Two-Factor Authentication Setup",
  "Daily Digest: Top Stories from Your Network",
  "Reminder: Upcoming Appointment Tomorrow at 3 PM",
  "Special Announcement: Company Merger News",
  "Training Session: New Software Implementation",
  "Billing Notice: Updated Payment Method Required",
  "Customer Success: Best Practices Webinar",
  "Alert: Unusual Account Activity Detected",
  "Partnership Opportunity: Collaboration Proposal",
  "Product Update: New Features Now Available",
  "Feedback Request: Recent Support Experience",
  "Holiday Schedule: Office Closure Announcement",
  "Performance Report: Q1 2024 Analytics",
  "Verification Required: Email Address Confirmation",
  "Support Ticket Resolved: Issue #98765",
  "Network Maintenance: Temporary Service Interruption",
  "Content Update: New Articles Published",
  "Compliance Notice: Policy Changes Effective Immediately",
  "Team Meeting: Project Status Review",
  "Flash Sale: 24-Hour Limited Time Offer",
  "System Alert: Server Upgrade Completed",
  "Monthly Summary: Account Activity Report",
  "Registration Confirmation: Event Attendance",
  "Price Change Notice: Service Plan Updates",
  "Tutorial: How to Use Advanced Features",
  "Community Update: New Discussion Topics",
  "Backup Complete: Data Security Confirmation",
  "Access Request: Permission Level Change",
  "Newsletter Subscription: Confirmation Required",
  "Critical Update: Security Patch Installation",
  "Referral Program: Earn Rewards for Inviting Friends",
  "Survey Results: Thank You for Your Participation"
];

const getRandomCategory1 = (): string => {
  const categories = ['x1', 'x2'];
  return categories[Math.floor(Math.random() * categories.length)];
};

const getRandomCategory2 = (category1: string): string => {
  if (category1 === 'x1') {
    const categories = ['x11', 'x12', 'x13'];
    return categories[Math.floor(Math.random() * categories.length)];
  } else {
    const categories = ['x21', 'x22', 'x23', 'x24'];
    return categories[Math.floor(Math.random() * categories.length)];
  }
};

const getRandomScore = (): number => {
  // Generate scores with some 0s to test validation
  const scores = [0, 15, 25, 35, 45, 55, 65, 75, 85, 95, 100];
  return scores[Math.floor(Math.random() * scores.length)];
};

export const generateDummyData = (): ClassificationRow[] => {
  const data: ClassificationRow[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const category1 = getRandomCategory1();
    const category2 = getRandomCategory2(category1);
    const isApproved = i <= 12 ? 1 : 0; // First 12 are approved
    
    data.push({
      id: i,
      subject: emailSubjects[i - 1] || `Email Subject ${i}`,
      category_1: category1,
      score_1: getRandomScore(),
      category_2: category2,
      score_2: getRandomScore(),
      is_approved: isApproved
    });
  }
  
  return data;
};

export const categoryOptions = {
  category_1: [
    { value: 'x1', label: 'Category X1' },
    { value: 'x2', label: 'Category X2' }
  ],
  category_2: {
    x1: [
      { value: 'x11', label: 'Subcategory X11' },
      { value: 'x12', label: 'Subcategory X12' },
      { value: 'x13', label: 'Subcategory X13' }
    ],
    x2: [
      { value: 'x21', label: 'Subcategory X21' },
      { value: 'x22', label: 'Subcategory X22' },
      { value: 'x23', label: 'Subcategory X23' },
      { value: 'x24', label: 'Subcategory X24' }
    ]
  }
};