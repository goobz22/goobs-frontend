import { PricingProps } from './index'

// Type definition for alignment options
type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'

/**
 * Default configuration for the PricingTable component
 */
const defaultConfig: PricingProps = {
  // Configuration for the header grid
  headerGridConfig: {
    gridname: 'pricingtableheader',
    alignment: 'center' as Alignment,
    margintop: 1,
    marginbottom: 0,
    gridwidth: '100%',
  },
  // Configuration for the table title
  tabletitle: {
    text: 'Features',
    columnconfig: {
      row: 3,
      column: 1,
      gridname: 'pricingtableheader',
      alignment: 'left' as Alignment,
      marginleft: 1,
      mobilewidth: '100%',
      tabletwidth: '100%',
      computerwidth: '100%',
      cellconfig: {
        border: 'none',
        minHeight: '40px',
        width: '100%',
      },
    },
  },
  // Configuration for package columns
  packagecolumns: {
    columnconfig: {
      row: 1,
      column: 2,
      gridname: 'pricingtableheader',
      alignment: 'center' as Alignment,
      marginleft: 1,
      marginbottom: 1,
      mobilewidth: '80%',
      tabletwidth: '45%',
      computerwidth: '45%',
      cellconfig: {
        border: 'none',
        minHeight: '40px',
        width: '100%',
      },
    },
  },
  // Configuration for monthly pricing
  monthlyprice: {
    prices: 'Monthly Pricing - $10',
    columnconfig: {
      row: 2,
      column: 1,
      mobilewidth: '100%',
      tabletwidth: '45%',
      computerwidth: '45%',
      gridname: 'pricingtableheader',
      alignment: 'center' as Alignment,
      cellconfig: {
        border: 'none',
        minHeight: '40px',
        width: '100%',
      },
    },
  },
  // Configuration for annual pricing
  annualprice: {
    annualprices: 'Annual Pricing - $100',
    columnconfig: {
      row: 2,
      column: 2,
      mobilewidth: '100%',
      tabletwidth: '45%',
      computerwidth: '45%',
      gridname: 'pricingtableheader',
      alignment: 'center' as Alignment,
      cellconfig: {
        border: 'none',
        minHeight: '40px',
        width: '100%',
      },
    },
  },
  // Configuration for the feature grid
  featureGridConfig: {
    gridname: 'pricingtablefeatures',
    alignment: 'center' as Alignment,
    gridwidth: '100%',
  },
  // Configuration for features and subfeatures
  features: [
    {
      title: 'Frontend Components',
      infopopuptext: 'How do I choose the right plan?',
      titlelink: '',
      columnconfig: {
        row: 1,
        column: 1,
        mobilewidth: '80%',
        tabletwidth: '50%',
        computerwidth: '50%',
        gridname: 'pricingtablefeatures',
        alignment: 'left' as Alignment,
        marginleft: 1,
        cellconfig: {
          border: 'solid',
          minHeight: '40px',
        },
      },
      tiedtopackage: {
        row: 1,
        column: 2,
        tiedtopackages: 'true',
        mobilewidth: '20%',
        tabletwidth: '50%',
        computerwidth: '50%',
      },
      subfeatures: [
        {
          title: 'Pricing Table',
          titlelink: '',
          infopopuptext: 'Pricing table subfeature info',
          columnconfig: {
            row: 2,
            column: 1,
            mobilewidth: '80%',
            tabletwidth: '50%',
            computerwidth: '50%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as Alignment,
            marginleft: 3,
            cellconfig: {
              border: 'solid',
              minHeight: '40px',
            },
          },
          tiedtopackage: {
            row: 2,
            column: 2,
            tiedtopackages: 'true',
            mobilewidth: '20%',
            tabletwidth: '50%',
            computerwidth: '50%',
          },
        },
        {
          title: 'Feature Grid',
          titlelink: '',
          infopopuptext: 'Feature grid subfeature info',
          columnconfig: {
            row: 3,
            column: 1,
            mobilewidth: '80%',
            tabletwidth: '50%',
            computerwidth: '50%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as Alignment,
            marginleft: 3,
            cellconfig: {
              border: 'solid',
              minHeight: '40px',
            },
          },
          tiedtopackage: {
            row: 3,
            column: 2,
            tiedtopackages: 'true',
            mobilewidth: '20%',
            tabletwidth: '50%',
            computerwidth: '50%',
          },
        },
      ],
    },
    {
      title: 'Backend Capabilities',
      infopopuptext: 'What is the difference between the plans?',
      columnconfig: {
        row: 4,
        column: 1,
        mobilewidth: '80%',
        tabletwidth: '50%',
        computerwidth: '50%',
        gridname: 'pricingtablefeatures',
        alignment: 'left' as Alignment,
        marginleft: 1,
        cellconfig: {
          border: 'solid',
          minHeight: '40px',
        },
      },
      tiedtopackage: {
        row: 4,
        column: 2,
        tiedtopackages: 'true',
        mobilewidth: '20%',
        tabletwidth: '50%',
        computerwidth: '50%',
      },
      subfeatures: [
        {
          title: 'API Integration',
          titlelink: '',
          infopopuptext: 'API integration subfeature info',
          columnconfig: {
            row: 5,
            column: 1,
            mobilewidth: '80%',
            tabletwidth: '50%',
            computerwidth: '50%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as Alignment,
            marginleft: 3,
            cellconfig: {
              border: 'solid',
              minHeight: '40px',
            },
          },
          tiedtopackage: {
            row: 5,
            column: 2,
            tiedtopackages: 'true',
            mobilewidth: '20%',
            tabletwidth: '50%',
            computerwidth: '50%',
          },
        },
        {
          title: 'Database Support',
          titlelink: '',
          infopopuptext: 'Database support subfeature info',
          columnconfig: {
            row: 6,
            column: 1,
            mobilewidth: '80%',
            tabletwidth: '50%',
            computerwidth: '50%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as Alignment,
            marginleft: 3,
            cellconfig: {
              border: 'solid',
              minHeight: '40px',
            },
          },
          tiedtopackage: {
            row: 6,
            column: 2,
            tiedtopackages: 'true',
            mobilewidth: '20%',
            tabletwidth: '50%',
            computerwidth: '50%',
          },
        },
      ],
    },
  ],
  // Configuration for button columns
  buttoncolumns: {
    buttontexts: 'Learn More',
    buttonlinks: '#goobs-frontend-unlimited',
    columnconfig: {
      row: 7,
      column: 2,
      mobilewidth: '100%',
      tabletwidth: '50%',
      computerwidth: '50%',
      gridname: 'pricingtablefeatures',
      alignment: 'center' as Alignment,
      cellconfig: {
        border: 'none',
        minHeight: '50px',
        width: '50%',
      },
    },
  },
}

export default defaultConfig
