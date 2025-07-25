# DataSift 🔄

**Smart Data Cleaning & CSV Export Tool**

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.0+-1890ff?style=flat-square&logo=antdesign)](https://ant.design/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

A powerful, user-friendly web application for cleaning messy data and exporting it as CSV files. Built with modern web technologies for performance and accessibility.


https://go.screenpal.com/watch/cTiTI1nIqb5

[Datasift Demo](https://go.screenpal.com/watch/cTiTI1nIqb5)

## Features

### Smart Data Processing
- **Multi-format Support**: JSON arrays, CSV, TSV, and any delimited text data
- **Auto-detection**: Automatically detects delimiters and data structure
- **Intelligent Parsing**: Handles various data formats with robust error handling
- **Real-time Validation**: Instant feedback on data parsing and cleaning operations

### Advanced Data Cleaning
- **Whitespace Trimming**: Remove leading and trailing spaces
- **Special Character Removal**: Clean unwanted characters from data
- **Case Standardization**: Convert to lowercase, uppercase, or title case
- **Empty Value Handling**: Remove or preserve empty/null values
- **Duplicate Removal**: Eliminate duplicate rows automatically
- **Row Limiting**: Control the maximum number of rows processed

### Flexible Column Management
- **Interactive Selection**: Choose which columns to include in your output
- **Select All/None**: Quickly select or deselect all columns
- **Visual Preview**: See exactly which data will be processed
- **Dynamic Updates**: Column options update automatically with new data

### Data Insights
- **Live Statistics**: Real-time count of rows, columns, and data quality metrics
- **Quality Indicators**: Visual feedback on empty values and data completeness
- **Before/After Comparison**: See the impact of cleaning operations

### User Experience
- **Loading States**: Clear feedback during parsing and cleaning operations
- **Preview Control**: Toggle data preview visibility on/off
- **Reset Functionality**: One-click reset to start over
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Built with screen readers and keyboard navigation in mind

## Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/datasift.git
   cd datasift
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
datasift/
├── components/           # Reusable React components
│   ├── DataInputSection.tsx
│   ├── DataStatistics.tsx
│   ├── ColumnSelection.tsx
│   ├── CleaningOptions.tsx
│   └── DataPreview.tsx
├── utils/               # Utility functions
│   ├── dataParser.ts
│   ├── dataCleaner.ts
│   └── csvExporter.ts
├── styles/              # Global styles and Tailwind config
├── public/              # Static assets
└── pages/               # Next.js pages
```

## Usage Examples

### Basic Data Cleaning
1. **Input Data**: Paste your CSV, JSON, or delimited text data
2. **Parse**: Click "Parse Data" to structure your information
3. **Select Columns**: Choose which columns to keep
4. **Clean**: Apply cleaning rules (trim whitespace, remove duplicates, etc.)
5. **Export**: Download your cleaned data as a CSV file

### Supported Input Formats

**JSON Array:**
```json
[
  {"name": "John Doe", "email": "john@example.com", "age": 30},
  {"name": "Jane Smith", "email": "jane@example.com", "age": 25}
]
```

**CSV Data:**
```csv
name,email,age
John Doe,john@example.com,30
Jane Smith,jane@example.com,25
```

**Tab-separated or Custom Delimiters:**
```
name|email|age
John Doe|john@example.com|30
Jane Smith|jane@example.com|25
```

## Technology Stack

- **Framework**: [Next.js 13+](https://nextjs.org/) - React framework with server-side rendering
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Library**: [Ant Design](https://ant.design/) - Enterprise-class UI components
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Ant Design Icons](https://ant.design/components/icon/) - Beautiful SVG icons

## Component Architecture

DataSift follows a modular component architecture:

- **`DataSiftApp`**: Main application component managing global state
- **`DataInputSection`**: Handles data input, file upload, and parsing
- **`DataStatistics`**: Displays data overview and quality metrics
- **`ColumnSelection`**: Interactive column picker interface
- **`CleaningOptions`**: Data cleaning configuration panel
- **`DataPreview`**: Paginated table view with export functionality

## Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_APP_NAME=DataSift
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Customization
- **Styling**: Modify Tailwind classes in components
- **Themes**: Customize Ant Design theme in `tailwind.config.js`
- **Features**: Add new cleaning rules in the utility functions

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Write TypeScript for type safety
- Follow the existing component structure
- Add proper error handling
- Include responsive design considerations
- Test on multiple browsers and devices

## Bug Reports

Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Sample data (if applicable)

## Performance

DataSift is optimized for performance:
- **Client-side Processing**: No server uploads required
- **Memory Efficient**: Processes large datasets without browser crashes
- **Lazy Loading**: Components load only when needed
- **Responsive UI**: Smooth interactions even with large datasets

## Privacy & Security

- **Local Processing**: All data processing happens in your browser
- **No Server Storage**: Data never leaves your device
- **No Tracking**: No analytics or user tracking
- **Open Source**: Full transparency in code and functionality

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ant Design](https://ant.design/) for the beautiful UI components
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first approach
- Open source community for inspiration and feedback

## Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

---

**Made with ❤️ by [Anuoluwapo Oyetibo](https://github.com/aoyetibo557)**

*DataSift - Making data cleaning simple, fast, and accessible to everyone.*
