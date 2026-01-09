# CrossNations Backend - Changelog

## [Latest] - 2024-01-15

### Added
- **Company Integration in Job Creation**: Jobs can now include company details during creation
- **Enhanced Job POST Endpoint**: Added optional company object to job creation request

### Changed
- **POST /api/jobs**: Updated to accept company information as nested object
  - Added company fields: name, description, website, logo, size, founded, industry, location, contact
  - Response now returns both job and company objects after creation
  - Company creation is optional - jobs can still be created without company details

### API Updates
- Updated job creation schema to include company object
- Enhanced response format to return company data alongside job data
- Maintained backward compatibility for jobs without company information

### Documentation
- Updated WORKING_API.md with new job creation schema
- Added company object validation rules
- Included example requests and responses for company integration

### Technical Details
- Company object is optional in job creation request
- All company fields are optional when provided
- Industry field in company object accepts array of industry values
- Contact object includes email and phone fields