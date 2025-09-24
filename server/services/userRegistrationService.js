const User = require('../models/User');
const Message = require('../models/Message');

// Welcome message template
const WELCOME_TEMPLATE = {
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
  quickReplies: [
    "Thanks! How do I find creators?",
    "I need help with my account",
    "How do subscriptions work?",
    "I want to become a creator"
  ]
};

class UserRegistrationService {
  // Register a new user and send welcome message
  static async registerUser(userData) {
    try {
      const { username, email, password, displayName, role = 'subscriber', auth0Id } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email },
          { username },
          ...(auth0Id ? [{ auth0Id }] : [])
        ]
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists with this email or username'
        };
      }

      // Create new user
      const newUser = new User({
        username,
        email,
        password, // In production, hash this password
        displayName,
        role,
        auth0Id,
        isVerified: false,
        profile: {
          bio: '',
          avatar: '',
          socialLinks: {}
        },
        preferences: {
          notifications: true,
          emailUpdates: true,
          privacy: 'public'
        }
      });

      await newUser.save();

      // Send welcome message
      await this.sendWelcomeMessage(newUser._id, newUser.email, newUser.displayName);

      return {
        success: true,
        data: newUser,
        message: 'User registered successfully and welcome message sent'
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return {
        success: false,
        message: 'Failed to register user'
      };
    }
  }

  // Send welcome message to new user
  static async sendWelcomeMessage(userId, userEmail, userName) {
    try {
      // Get or create Matty's user account
      let mattyUser = await User.findOne({ email: 'matty@vibecodes.space' });
      
      if (!mattyUser) {
        // Create Matty's system account
        mattyUser = new User({
          username: 'matty',
          email: 'matty@vibecodes.space',
          displayName: 'Matty',
          role: 'admin',
          isSystemAccount: true,
          profile: {
            bio: 'Founder & CEO of Velour. Here to help you get the most out of our platform!',
            avatar: '',
            socialLinks: {}
          }
        });
        await mattyUser.save();
      }

      // Check if welcome message already exists
      const existingWelcome = await Message.findOne({
        fromUserId: mattyUser._id,
        toUserId: userId,
        type: 'welcome'
      });

      if (existingWelcome) {
        return {
          success: true,
          data: existingWelcome,
          message: 'Welcome message already sent'
        };
      }

      // Create welcome message
      const welcomeMessage = new Message({
        fromUserId: mattyUser._id,
        toUserId: userId,
        content: WELCOME_TEMPLATE.content.replace('{{userName}}', userName || 'there'),
        subject: WELCOME_TEMPLATE.subject,
        type: 'welcome',
        metadata: {
          quickReplies: WELCOME_TEMPLATE.quickReplies,
          isSystemMessage: true,
          templateVersion: '1.0'
        }
      });

      await welcomeMessage.save();

      console.log(`✅ Welcome message sent to ${userEmail} (${userName})`);

      return {
        success: true,
        data: welcomeMessage,
        message: 'Welcome message sent successfully'
      };
    } catch (error) {
      console.error('Error sending welcome message:', error);
      return {
        success: false,
        message: 'Failed to send welcome message'
      };
    }
  }

  // Check if user has received welcome message
  static async hasReceivedWelcome(userId) {
    try {
      const welcomeMessage = await Message.findOne({
        toUserId: userId,
        type: 'welcome'
      });

      return {
        success: true,
        data: {
          hasReceived: !!welcomeMessage,
          messageId: welcomeMessage?._id
        }
      };
    } catch (error) {
      console.error('Error checking welcome status:', error);
      return {
        success: false,
        message: 'Failed to check welcome status'
      };
    }
  }

  // Mark welcome message as read
  static async markWelcomeAsRead(userId, messageId) {
    try {
      const message = await Message.findOneAndUpdate(
        {
          _id: messageId,
          toUserId: userId,
          type: 'welcome'
        },
        { read: true, readAt: new Date() },
        { new: true }
      );

      if (!message) {
        return {
          success: false,
          message: 'Welcome message not found'
        };
      }

      return {
        success: true,
        data: message,
        message: 'Welcome message marked as read'
      };
    } catch (error) {
      console.error('Error marking welcome as read:', error);
      return {
        success: false,
        message: 'Failed to mark welcome as read'
      };
    }
  }

  // Get welcome message for user
  static async getWelcomeMessage(userId) {
    try {
      const welcomeMessage = await Message.findOne({
        toUserId: userId,
        type: 'welcome'
      }).populate('fromUserId', 'displayName email username');

      if (!welcomeMessage) {
        return {
          success: false,
          message: 'Welcome message not found'
        };
      }

      return {
        success: true,
        data: welcomeMessage
      };
    } catch (error) {
      console.error('Error fetching welcome message:', error);
      return {
        success: false,
        message: 'Failed to fetch welcome message'
      };
    }
  }
}

module.exports = UserRegistrationService;
