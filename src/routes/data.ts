import express from 'express';
import { Request, Response } from 'express';
import Job from '../models/Job';

const router = express.Router();

// Get available industries
router.get('/industries', async (req: Request, res: Response) => {
  try {
    const industriesData = [
      {
        value: 'health',
        label: 'Healthcare & Medical',
        description: 'Healthcare professionals, medical practitioners, and support staff'
      },
      {
        value: 'hospitality',
        label: 'Hospitality & Tourism',
        description: 'Hotels, restaurants, tourism, and customer service roles'
      },
      {
        value: 'childcare',
        label: 'Childcare & Education',
        description: 'Early childhood education, childcare workers, and educators'
      },
      {
        value: 'construction',
        label: 'Construction & Trades',
        description: 'Building, construction, electrical, plumbing, and trade work'
      },
      {
        value: 'mining',
        label: 'Mining & Resources',
        description: 'Mining operations, FIFO roles, and resource extraction'
      },
      {
        value: 'technology',
        label: 'Technology & IT',
        description: 'Software development, IT support, and technology roles'
      }
    ];

    // Get job counts for each industry
    const jobCounts = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$industry', count: { $sum: 1 } } }
    ]);

    const industries = industriesData.map(industry => {
      const countData = jobCounts.find(item => item._id === industry.value);
      return {
        ...industry,
        jobCount: countData ? countData.count : 0
      };
    });

    res.json({
      success: true,
      data: { industries }
    });
  } catch (error: any) {
    console.error('Get industries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get available locations
router.get('/locations', async (req: Request, res: Response) => {
  try {
    const statesData = [
      {
        state: 'NSW',
        cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Blue Mountains']
      },
      {
        state: 'VIC',
        cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton']
      },
      {
        state: 'QLD',
        cities: ['Brisbane', 'Gold Coast', 'Cairns', 'Townsville', 'Toowoomba']
      },
      {
        state: 'WA',
        cities: ['Perth', 'Fremantle', 'Bunbury', 'Geraldton', 'Kalgoorlie']
      },
      {
        state: 'SA',
        cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta', 'Murray Bridge']
      },
      {
        state: 'TAS',
        cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston']
      },
      {
        state: 'ACT',
        cities: ['Canberra', 'Gungahlin', 'Tuggeranong', 'Belconnen', 'Woden']
      },
      {
        state: 'NT',
        cities: ['Darwin', 'Alice Springs', 'Katherine', 'Nhulunbuy', 'Tennant Creek']
      }
    ];

    // Get job counts by location
    const locationCounts = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location', count: { $sum: 1 } } }
    ]);

    const locations = statesData.map(stateData => ({
      state: stateData.state,
      cities: stateData.cities.map(city => {
        const countData = locationCounts.find(item => 
          item._id && item._id.toLowerCase().includes(city.toLowerCase())
        );
        return {
          name: city,
          jobCount: countData ? countData.count : 0
        };
      })
    }));

    res.json({
      success: true,
      data: { locations }
    });
  } catch (error: any) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get popular skills by industry
router.get('/skills', async (req: Request, res: Response) => {
  try {
    const { industry } = req.query;

    const skillsData: Record<string, any[]> = {
      health: [
        { name: 'Patient Care', category: 'Clinical', popularity: 95 },
        { name: 'Medical Records', category: 'Administrative', popularity: 80 },
        { name: 'CPR Certification', category: 'Certification', popularity: 90 },
        { name: 'Nursing', category: 'Clinical', popularity: 85 },
        { name: 'First Aid', category: 'Certification', popularity: 88 }
      ],
      hospitality: [
        { name: 'Customer Service', category: 'Service', popularity: 95 },
        { name: 'Food Safety', category: 'Certification', popularity: 85 },
        { name: 'POS Systems', category: 'Technical', popularity: 70 },
        { name: 'Event Management', category: 'Management', popularity: 65 },
        { name: 'RSA Certificate', category: 'Certification', popularity: 80 }
      ],
      childcare: [
        { name: 'Child Development', category: 'Educational', popularity: 90 },
        { name: 'Early Childhood Education', category: 'Educational', popularity: 95 },
        { name: 'Behavior Management', category: 'Management', popularity: 85 },
        { name: 'First Aid (Child)', category: 'Certification', popularity: 92 },
        { name: 'Activity Planning', category: 'Creative', popularity: 80 }
      ],
      construction: [
        { name: 'Safety Protocols', category: 'Safety', popularity: 95 },
        { name: 'Blueprint Reading', category: 'Technical', popularity: 85 },
        { name: 'Power Tools', category: 'Technical', popularity: 90 },
        { name: 'White Card', category: 'Certification', popularity: 98 },
        { name: 'Project Management', category: 'Management', popularity: 70 }
      ],
      mining: [
        { name: 'FIFO Experience', category: 'Operational', popularity: 90 },
        { name: 'Heavy Machinery', category: 'Technical', popularity: 85 },
        { name: 'Safety Training', category: 'Safety', popularity: 98 },
        { name: 'Mining Operations', category: 'Operational', popularity: 88 },
        { name: 'HR Licence', category: 'Certification', popularity: 80 }
      ],
      technology: [
        { name: 'JavaScript', category: 'Programming', popularity: 90 },
        { name: 'React', category: 'Framework', popularity: 85 },
        { name: 'Node.js', category: 'Backend', popularity: 80 },
        { name: 'Python', category: 'Programming', popularity: 88 },
        { name: 'AWS', category: 'Cloud', popularity: 75 }
      ]
    };

    let skills = [];
    if (industry && skillsData[industry as string]) {
      skills = skillsData[industry as string];
    } else {
      // Return all skills if no industry specified
      skills = Object.values(skillsData).flat();
    }

    res.json({
      success: true,
      data: { skills }
    });
  } catch (error: any) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;