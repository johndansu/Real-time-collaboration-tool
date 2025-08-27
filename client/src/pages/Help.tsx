import React, { useState } from "react";
import {
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  Users,
  Settings,
  Zap,
} from "lucide-react";

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const faqs = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Zap,
      questions: [
        {
          question: "How do I create my first project?",
          answer:
            "Click the 'New Project' button in the sidebar, fill in the project details, and click 'Create Project'. You can then invite team members and start collaborating.",
        },
        {
          question: "How do I invite team members?",
          answer:
            "Go to your project page, click on the 'Team' tab, and use the 'Invite Member' button. Enter their email address and assign a role.",
        },
        {
          question: "What are the different user roles?",
          answer:
            "Owner: Full control over the project. Admin: Can manage team and content. Member: Can view and edit content. Viewer: Read-only access.",
        },
      ],
    },
    {
      id: "collaboration",
      title: "Real-time Collaboration",
      icon: Users,
      questions: [
        {
          question: "How does real-time editing work?",
          answer:
            "Multiple users can edit documents simultaneously. Changes are synchronized in real-time using WebSocket technology. You'll see other users' cursors and changes as they happen.",
        },
        {
          question: "Can I see who made what changes?",
          answer:
            "Yes! The system tracks all changes with user attribution. You can view the edit history and see exactly who made each modification.",
        },
        {
          question: "What happens if I lose my internet connection?",
          answer:
            "Your changes are saved locally and will sync when you reconnect. You'll see a notification if there are any conflicts that need resolution.",
        },
      ],
    },
    {
      id: "documents",
      title: "Document Management",
      icon: FileText,
      questions: [
        {
          question: "What file types are supported?",
          answer:
            "We support text documents (.txt, .md), rich text documents, and various image formats. More file types will be added in future updates.",
        },
        {
          question: "How do I organize my documents?",
          answer:
            "Use folders and tags to organize your documents. You can create a hierarchical structure and search through your content easily.",
        },
        {
          question: "Can I export my documents?",
          answer:
            "Yes! You can export documents in various formats including PDF, Word, and plain text. Go to the document menu and select 'Export'.",
        },
      ],
    },
    {
      id: "communication",
      title: "Communication Tools",
      icon: MessageCircle,
      questions: [
        {
          question: "How do I start a chat with someone?",
          answer:
            "Go to the Chat page, search for the person you want to chat with, and click on their name to start a conversation.",
        },
        {
          question: "Can I make video calls?",
          answer:
            "Yes! Use the Video Call feature to start or join video conferences. You can share your screen and collaborate in real-time.",
        },
        {
          question: "Are chat messages saved?",
          answer:
            "Chat messages are saved for 30 days by default. You can adjust this in your settings or export important conversations.",
        },
      ],
    },
    {
      id: "settings",
      title: "Account & Settings",
      icon: Settings,
      questions: [
        {
          question: "How do I change my password?",
          answer:
            "Go to Settings > Security, enter your current password, and set a new one. Make sure to use a strong, unique password.",
        },
        {
          question: "Can I customize the interface?",
          answer:
            "Yes! Go to Settings > Appearance to change themes, language, and other visual preferences.",
        },
        {
          question: "How do I manage notifications?",
          answer:
            "Go to Settings > Notifications to configure email, push, and desktop notifications for different activities.",
        },
      ],
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@collabtool.com",
      response: "Within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      response: "Mon-Fri, 9AM-6PM EST",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with support",
      contact: "Available in app",
      response: "24/7 availability",
    },
  ];

  const filteredFaqs = faqs.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.questions.some(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Help & Support
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions, learn how to use CollabTool, and get
          the support you need.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help topics, questions, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Documentation
          </h3>
          <p className="text-gray-600">Comprehensive guides and tutorials</p>
        </div>

        <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
          <Video className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Video Tutorials
          </h3>
          <p className="text-gray-600">Step-by-step video guides</p>
        </div>

        <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
          <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Community
          </h3>
          <p className="text-gray-600">Connect with other users</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>

        {filteredFaqs.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className="card">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-6 space-y-4">
                  {section.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-200 pl-4"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Still Need Help?
        </h2>
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for? Our support team is here to help
          you get the most out of CollabTool.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {method.description}
                </p>
                <p className="font-medium text-blue-600 mb-1">
                  {method.contact}
                </p>
                <p className="text-xs text-gray-500">{method.response}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Additional Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Getting Started
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Quick Start Guide</li>
              <li>• Feature Overview</li>
              <li>• Best Practices</li>
              <li>• Keyboard Shortcuts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Advanced Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• API Documentation</li>
              <li>• Custom Integrations</li>
              <li>• Workflow Automation</li>
              <li>• Performance Tips</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
