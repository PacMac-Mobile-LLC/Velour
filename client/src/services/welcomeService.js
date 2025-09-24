import api from './api';

// Welcome Message Service
export const welcomeService = {
  // Send welcome message to new user
  async sendWelcomeMessage(userId, userEmail, userName) {
    try {
      const response = await api.post('/api/welcome/send-message', {
        userId,
        userEmail,
        userName
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error sending welcome message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send welcome message'
      };
    }
  },

  // Get welcome message template
  async getWelcomeTemplate() {
    try {
      const response = await api.get('/api/welcome/template');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching welcome template:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch welcome template'
      };
    }
  },

  // Update welcome message template
  async updateWelcomeTemplate(template) {
    try {
      const response = await api.put('/api/welcome/template', template);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating welcome template:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update welcome template'
      };
    }
  },

  // Check if user has received welcome message
  async hasReceivedWelcome(userId) {
    try {
      const response = await api.get(`/api/welcome/status/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error checking welcome status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check welcome status'
      };
    }
  },

  // Mark welcome message as read
  async markWelcomeAsRead(userId, messageId) {
    try {
      const response = await api.put(`/api/welcome/mark-read/${userId}/${messageId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error marking welcome as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark welcome as read'
      };
    }
  }
};

// Default welcome message template
export const defaultWelcomeTemplate = {
  subject: "Welcome to Velour! 🎉",
  content: `Hi {{userName}}! 👋

Welcome to Velour - Where Desire Meets Luxury! I'm Matty, the founder of this platform, and I'm thrilled to have you join our community of creators and fans.

🎯 **What you can do on Velour:**
• Subscribe to your favorite creators for exclusive content
• Discover amazing creators through our recommendation system
• Send direct messages to creators you're subscribed to
• Organize creators into custom collections
• Access private content in creator vaults
• Schedule live sessions with creators
• Track your subscription analytics and statements

💬 **Need Help?**
I'm here to help! You can always DM me directly for:
• Platform questions and support
• Feature requests and feedback
• Technical issues
• Creator account setup
• Payment or subscription help

🚀 **Getting Started:**
1. Browse our featured creators on the homepage
2. Subscribe to creators you love
3. Start building your collections
4. Explore the vault for exclusive content
5. Don't hesitate to reach out if you need anything!

Thank you for choosing Velour. I'm excited to see what amazing connections you'll make here!

Best regards,
Matty
Founder & CEO, Velour

P.S. - Follow me @matty for platform updates and behind-the-scenes content! ✨`,
  attachments: [
    {
      type: 'image',
      url: '/images/welcome-banner.jpg',
      alt: 'Welcome to Velour'
    }
  ],
  quickReplies: [
    {
      text: "Thanks! How do I find creators?",
      action: "help_find_creators"
    },
    {
      text: "I need help with my account",
      action: "help_account"
    },
    {
      text: "How do subscriptions work?",
      action: "help_subscriptions"
    },
    {
      text: "I want to become a creator",
      action: "help_become_creator"
    }
  ]
};

export default welcomeService;
