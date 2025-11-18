import { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Users, Award, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const WorkExperience = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companies = [
    {
      id: 1,
      name: 'Tech Innovators Inc',
      logo: '🚀',
      tagline: 'Building the future of technology',
      location: 'London, UK',
      type: 'Tech Startup',
      size: '50-200 employees',
      positions: [
        {
          title: 'Software Engineering Intern',
          duration: '3-6 months',
          salary: '£25,000 - £30,000',
          type: 'Internship',
        },
        {
          title: 'Junior Developer',
          duration: 'Full-time',
          salary: '£35,000 - £45,000',
          type: 'Entry Level',
        },
      ],
      description: 'Tech Innovators Inc is a fast-growing startup focused on developing cutting-edge AI solutions for businesses. We offer a dynamic work environment where interns and junior developers can learn from experienced engineers.',
      benefits: [
        'Flexible working hours',
        'Remote work options',
        'Learning & development budget',
        'Modern office space',
        'Team social events',
      ],
      requirements: [
        'Basic programming knowledge (Python, JavaScript, or Java)',
        'Strong problem-solving skills',
        'Passion for technology',
        'Good communication skills',
      ],
      applicationUrl: 'https://example.com/apply',
    },
    {
      id: 2,
      name: 'Global Finance Corp',
      logo: '💼',
      tagline: 'Leading financial services worldwide',
      location: 'Manchester, UK',
      type: 'Finance',
      size: '1000+ employees',
      positions: [
        {
          title: 'Finance Analyst Intern',
          duration: '6-12 months',
          salary: '£28,000 - £32,000',
          type: 'Internship',
        },
        {
          title: 'Graduate Analyst',
          duration: 'Full-time',
          salary: '£40,000 - £50,000',
          type: 'Graduate',
        },
      ],
      description: 'Global Finance Corp is one of the world\'s leading financial institutions. Our internship programs provide hands-on experience in financial analysis, investment banking, and risk management.',
      benefits: [
        'Competitive salary',
        'Comprehensive training program',
        'Career progression opportunities',
        'Health & wellness benefits',
        'Pension scheme',
      ],
      requirements: [
        'Degree in Finance, Economics, or related field',
        'Strong analytical skills',
        'Proficiency in Excel',
        'Interest in financial markets',
      ],
      applicationUrl: 'https://example.com/apply',
    },
    {
      id: 3,
      name: 'Creative Design Studio',
      logo: '🎨',
      tagline: 'Where creativity meets innovation',
      location: 'Birmingham, UK',
      type: 'Creative Agency',
      size: '20-50 employees',
      positions: [
        {
          title: 'Graphic Design Intern',
          duration: '3 months',
          salary: '£20,000 - £24,000',
          type: 'Internship',
        },
        {
          title: 'UX/UI Designer',
          duration: 'Full-time',
          salary: '£30,000 - £40,000',
          type: 'Entry Level',
        },
      ],
      description: 'Creative Design Studio specializes in branding, digital design, and creative campaigns for major brands. Join our team and work on exciting projects that shape how people interact with products.',
      benefits: [
        'Creative freedom',
        'Portfolio development',
        'Mentorship from senior designers',
        'Flexible hours',
        'Modern equipment (Mac, iPad Pro)',
      ],
      requirements: [
        'Portfolio of design work',
        'Proficiency in Adobe Creative Suite or Figma',
        'Understanding of design principles',
        'Creative thinking',
      ],
      applicationUrl: 'https://example.com/apply',
    },
    {
      id: 4,
      name: 'HealthTech Solutions',
      logo: '⚕️',
      tagline: 'Revolutionizing healthcare with technology',
      location: 'Edinburgh, UK',
      type: 'HealthTech',
      size: '100-500 employees',
      positions: [
        {
          title: 'Data Science Intern',
          duration: '6 months',
          salary: '£26,000 - £30,000',
          type: 'Internship',
        },
        {
          title: 'Junior Data Analyst',
          duration: 'Full-time',
          salary: '£38,000 - £48,000',
          type: 'Entry Level',
        },
      ],
      description: 'HealthTech Solutions is pioneering the use of AI and data analytics to improve patient outcomes. Work with real healthcare data and make a meaningful impact on people\'s lives.',
      benefits: [
        'Impactful work',
        'Professional development',
        'Health insurance',
        'Collaborative environment',
        'Conference attendance',
      ],
      requirements: [
        'Background in Computer Science, Statistics, or related field',
        'Python or R programming skills',
        'Understanding of data analysis',
        'Interest in healthcare',
      ],
      applicationUrl: 'https://example.com/apply',
    },
    {
      id: 5,
      name: 'Marketing Masters Ltd',
      logo: '📱',
      tagline: 'Digital marketing excellence',
      location: 'Bristol, UK',
      type: 'Marketing',
      size: '50-100 employees',
      positions: [
        {
          title: 'Marketing Intern',
          duration: '3-6 months',
          salary: '£22,000 - £26,000',
          type: 'Internship',
        },
        {
          title: 'Junior Marketing Executive',
          duration: 'Full-time',
          salary: '£28,000 - £35,000',
          type: 'Entry Level',
        },
      ],
      description: 'Marketing Masters is a full-service digital marketing agency helping brands grow their online presence. Learn social media marketing, SEO, content creation, and campaign management.',
      benefits: [
        'Diverse project exposure',
        'Training in latest marketing tools',
        'Remote work flexibility',
        'Team outings',
        'Career growth opportunities',
      ],
      requirements: [
        'Strong communication skills',
        'Interest in digital marketing',
        'Social media savvy',
        'Creative mindset',
      ],
      applicationUrl: 'https://example.com/apply',
    },
    {
      id: 6,
      name: 'EcoGreen Energy',
      logo: '🌱',
      tagline: 'Sustainable energy for a better tomorrow',
      location: 'Leeds, UK',
      type: 'Energy & Sustainability',
      size: '200-500 employees',
      positions: [
        {
          title: 'Engineering Intern',
          duration: '6-12 months',
          salary: '£24,000 - £28,000',
          type: 'Internship',
        },
        {
          title: 'Graduate Engineer',
          duration: 'Full-time',
          salary: '£32,000 - £42,000',
          type: 'Graduate',
        },
      ],
      description: 'EcoGreen Energy is at the forefront of renewable energy technology. Work on real projects in wind, solar, and battery storage that contribute to a sustainable future.',
      benefits: [
        'Meaningful work',
        'Professional certification support',
        'Competitive benefits package',
        'Career development program',
        'Work-life balance',
      ],
      requirements: [
        'Engineering degree (Mechanical, Electrical, or related)',
        'Interest in renewable energy',
        'Problem-solving skills',
        'Team player',
      ],
      applicationUrl: 'https://example.com/apply',
    },
  ];

  const toggleCompany = (companyId) => {
    if (selectedCompany === companyId) {
      setSelectedCompany(null);
    } else {
      setSelectedCompany(companyId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark-700 to-dark-900 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Work Experience Opportunities</h1>
                <p className="text-dark-100">
                  Explore internships and entry-level positions from top companies
                </p>
              </div>
            </div>
          </div>

          {/* Companies List */}
          <div className="space-y-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
              >
                {/* Company Card Header - Clickable */}
                <div
                  onClick={() => toggleCompany(company.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-5xl">{company.logo}</div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {company.name}
                        </h2>
                        <p className="text-gray-600 mb-3">{company.tagline}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{company.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{company.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{company.size}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {company.positions.map((position, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                            >
                              {position.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors ml-4">
                      {selectedCompany === company.id ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Company Details */}
                {selectedCompany === company.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* About */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">About the Company</h3>
                      <p className="text-gray-700 leading-relaxed">{company.description}</p>
                    </div>

                    {/* Open Positions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Open Positions</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {company.positions.map((position, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <h4 className="font-bold text-gray-900 mb-2">{position.title}</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{position.duration}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4" />
                                <span>{position.salary}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4" />
                                <span>{position.type}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits & Perks</h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {company.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-gray-700">
                            <span className="text-green-600 mt-1">✓</span>
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {company.requirements.map((requirement, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-gray-700">
                            <span className="text-primary-600 mt-1">•</span>
                            <span className="text-sm">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex justify-end">
                      <button className="bg-dark-600 text-white px-6 py-3 rounded-lg hover:bg-dark-700 transition-colors flex items-center space-x-2 font-medium">
                        <span>Apply Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
