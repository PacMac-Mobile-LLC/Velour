const axios = require('axios');
const User = require('../models/User');
const Verification = require('../models/Verification');

// Didit.me API configuration
const DIDIT_CONFIG = {
  apiKey: process.env.DIDIT_API_KEY || '21VsbJJtfkPlLDOEGeTue1v2j_do6n4uZC3bcTZG75c',
  secretKey: process.env.DIDIT_SECRET_KEY || 'wW856WlimdwlD5XUmASGq4qqfhvsrjLj9yDwn_Ouzn4',
  baseUrl: 'https://api.didit.me/v1',
  webhookUrl: process.env.DIDIT_WEBHOOK_URL || 'https://velour-wxv9.onrender.com/api/verification/didit/webhook'
};

class DiditService {
  // Initialize age verification session
  static async initializeVerification(userId, userEmail, userData) {
    try {
      console.log('🔐 Initializing Didit verification for user:', userId);

      // Check if user already has a verification record
      let verification = await Verification.findOne({ userId });
      
      if (verification && verification.status === 'verified') {
        return {
          success: true,
          data: verification,
          message: 'User already verified'
        };
      }

      // Prepare verification request data
      const verificationData = {
        email: userEmail,
        name: userData.name,
        metadata: {
          userId: userId,
          platform: 'velour',
          userEmail: userEmail
        },
        webhook_url: DIDIT_CONFIG.webhookUrl,
        redirect_url: `${process.env.FRONTEND_URL}/dashboard?verification=complete`
      };

      // Make API call to Didit
      const response = await axios.post(
        `${DIDIT_CONFIG.baseUrl}/verifications`,
        verificationData,
        {
          headers: {
            'Authorization': `Bearer ${DIDIT_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const diditResponse = response.data;

      // Create or update verification record
      if (verification) {
        verification.diditId = diditResponse.id;
        verification.status = 'pending';
        verification.verificationUrl = diditResponse.verification_url;
        verification.updatedAt = new Date();
      } else {
        verification = new Verification({
          userId,
          diditId: diditResponse.id,
          status: 'pending',
          verificationUrl: diditResponse.verification_url,
          userEmail,
          userData,
          metadata: {
            platform: 'velour',
            initiatedAt: new Date()
          }
        });
      }

      await verification.save();

      console.log('✅ Didit verification initialized:', diditResponse.id);

      return {
        success: true,
        data: {
          verificationId: verification._id,
          diditId: diditResponse.id,
          verificationUrl: diditResponse.verification_url,
          status: 'pending'
        },
        message: 'Verification session created successfully'
      };

    } catch (error) {
      console.error('❌ Error initializing Didit verification:', error);
      
      if (error.response) {
        console.error('Didit API Error:', error.response.data);
        return {
          success: false,
          message: `Verification failed: ${error.response.data.message || 'Unknown error'}`
        };
      }

      return {
        success: false,
        message: 'Failed to initialize verification process'
      };
    }
  }

  // Get verification status
  static async getVerificationStatus(userId) {
    try {
      const verification = await Verification.findOne({ userId });
      
      if (!verification) {
        return {
          success: true,
          data: {
            status: 'not_started',
            message: 'No verification found'
          }
        };
      }

      // If verification is pending, check with Didit API
      if (verification.status === 'pending' && verification.diditId) {
        try {
          const response = await axios.get(
            `${DIDIT_CONFIG.baseUrl}/verifications/${verification.diditId}`,
            {
              headers: {
                'Authorization': `Bearer ${DIDIT_CONFIG.apiKey}`
              }
            }
          );

          const diditData = response.data;
          
          // Update status based on Didit response
          if (diditData.status !== verification.status) {
            verification.status = diditData.status;
            verification.updatedAt = new Date();
            
            if (diditData.status === 'verified') {
              verification.verifiedAt = new Date();
              verification.verificationData = diditData;
              
              // Update user's verification status
              await User.findOneAndUpdate(
                { _id: userId },
                { 
                  isAgeVerified: true,
                  ageVerifiedAt: new Date()
                }
              );
            }
            
            await verification.save();
          }
        } catch (apiError) {
          console.error('Error checking Didit status:', apiError);
          // Continue with stored status if API call fails
        }
      }

      return {
        success: true,
        data: {
          status: verification.status,
          verificationId: verification._id,
          diditId: verification.diditId,
          verificationUrl: verification.verificationUrl,
          createdAt: verification.createdAt,
          updatedAt: verification.updatedAt,
          verifiedAt: verification.verifiedAt
        }
      };

    } catch (error) {
      console.error('Error getting verification status:', error);
      return {
        success: false,
        message: 'Failed to get verification status'
      };
    }
  }

  // Handle webhook from Didit
  static async handleWebhook(webhookData) {
    try {
      console.log('🔔 Received Didit webhook:', webhookData);

      const { verification_id, status, user_data } = webhookData;

      // Find verification record
      const verification = await Verification.findOne({ diditId: verification_id });
      
      if (!verification) {
        console.error('❌ Verification not found for Didit ID:', verification_id);
        return {
          success: false,
          message: 'Verification not found'
        };
      }

      // Update verification status
      verification.status = status;
      verification.updatedAt = new Date();
      verification.webhookData = webhookData;

      if (status === 'verified') {
        verification.verifiedAt = new Date();
        verification.verificationData = user_data;
        
        // Update user's verification status
        await User.findOneAndUpdate(
          { _id: verification.userId },
          { 
            isAgeVerified: true,
            ageVerifiedAt: new Date()
          }
        );

        console.log('✅ User age verified:', verification.userId);
      } else if (status === 'failed') {
        verification.failedAt = new Date();
        verification.failureReason = webhookData.reason || 'Verification failed';
        
        console.log('❌ User age verification failed:', verification.userId);
      }

      await verification.save();

      return {
        success: true,
        data: verification,
        message: 'Webhook processed successfully'
      };

    } catch (error) {
      console.error('Error processing Didit webhook:', error);
      return {
        success: false,
        message: 'Failed to process webhook'
      };
    }
  }

  // Get verification history
  static async getVerificationHistory(userId) {
    try {
      const verifications = await Verification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      return {
        success: true,
        data: verifications
      };

    } catch (error) {
      console.error('Error getting verification history:', error);
      return {
        success: false,
        message: 'Failed to get verification history'
      };
    }
  }

  // Resend verification
  static async resendVerification(userId) {
    try {
      const verification = await Verification.findOne({ userId });
      
      if (!verification) {
        return {
          success: false,
          message: 'No verification found to resend'
        };
      }

      // Reset verification status
      verification.status = 'pending';
      verification.updatedAt = new Date();
      await verification.save();

      // Get user data
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Reinitialize verification
      return await this.initializeVerification(
        userId,
        user.email,
        {
          name: user.displayName || user.username,
          email: user.email
        }
      );

    } catch (error) {
      console.error('Error resending verification:', error);
      return {
        success: false,
        message: 'Failed to resend verification'
      };
    }
  }
}

module.exports = DiditService;
