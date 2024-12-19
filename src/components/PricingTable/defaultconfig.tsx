import { PricingProps } from './index'

/**
 * Default configuration for the PricingTable component
 *
 * All margin and padding values are now defined as ResponsiveObject<number> directly
 * in the columnconfig, allowing you to edit each breakpoint value individually.
 */

const defaultConfig: PricingProps = {
  // Configuration for the header grid
  headerGridConfig: {
    gridname: 'pricingtableheader',
    alignment: 'center' as const,
    gridwidth: '100%',
  },
  // Configuration for the table title
  tabletitle: {
    text: 'Features',
    columnconfig: {
      row: 3,
      column: 1,
      gridname: 'pricingtableheader',
      alignment: 'left' as const,
      paddingleft: {
        xs: 2,
        sm: 2,
        md: 2,
        ms: 2,
        ml: 2,
        lg: 2,
        xl: 2,
      },
      paddingtop: {
        xs: 1,
        sm: 1,
        md: 1,
        ms: 1,
        ml: 1,
        lg: 1,
        xl: 1,
      },
      mobilewidth: '100%',
      tabletwidth: '100%',
      computerwidth: '50%',
    },
  },
  // Configuration for package columns
  packagecolumns: {
    packagenames: ['ThothOS', 'ThothOS Pro', 'ThothOS Enterprise'],
    columnconfig: {
      row: 1,
      column: 1,
      gridname: 'pricingtableheader',
      alignment: 'center' as const,
      paddingleft: {
        xs: 2,
        sm: 2,
        md: 2,
        ms: 2,
        ml: 2,
        lg: 2,
        xl: 2,
      },
      paddingright: {
        xs: 2,
        sm: 2,
        md: 2,
        ms: 2,
        ml: 2,
        lg: 2,
        xl: 2,
      },
      paddingtop: {
        xs: 2.5,
        sm: 2.5,
        md: 2.5,
        ms: 2.5,
        ml: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      paddingbottom: {
        xs: 1,
        sm: 2,
        md: 2,
        ms: 2,
        ml: 2,
        lg: 2,
        xl: 2,
      },
      mobilewidth: '100%',
      tabletwidth: '48%',
      computerwidth: '48%',
    },
  },
  // Configuration for monthly pricing
  monthlyprice: {
    prices: [
      'Monthly Pricing - $10',
      'Monthly Pricing - $20',
      'Monthly Pricing - $30',
    ],
    columnconfig: {
      row: 2,
      column: 1,
      mobilewidth: '100%',
      tabletwidth: '48%',
      computerwidth: '48%',
      gridname: 'pricingtableheader',
      alignment: 'center' as const,
    },
  },
  // Configuration for annual pricing
  annualprice: {
    annualprices: [
      'Annual Pricing - $100',
      'Annual Pricing - $200',
      'Annual Pricing - $300',
    ],
    columnconfig: {
      row: 2,
      column: 2,
      mobilewidth: '100%',
      tabletwidth: '48%',
      computerwidth: '48%',
      gridname: 'pricingtableheader',
      alignment: 'center' as const,
    },
  },
  // Configuration for the feature grid
  featureGridConfig: {
    gridname: 'pricingtablefeatures',
    alignment: 'center' as const,
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
        tabletwidth: '48%',
        computerwidth: '48%',
        gridname: 'pricingtablefeatures',
        alignment: 'left' as const,
      },
      tiedtopackage: {
        tiedtopackages: ['true', 'true', 'true'],
        columnconfig: {
          row: 1,
          column: 2,
          mobilewidth: '20%',
          tabletwidth: '48%',
          computerwidth: '48%',
          gridname: 'pricingtablefeatures',
          alignment: 'center' as const,
        },
      },
      subfeatures: [
        {
          title: 'Pricing Table',
          infopopuptext: 'Pricing table subfeature info',
          columnconfig: {
            row: 2,
            column: 1,
            mobilewidth: '80%',
            tabletwidth: '48%',
            computerwidth: '48%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as const,
          },
          tiedtopackage: {
            tiedtopackages: ['true', 'true', 'true'],
            columnconfig: {
              row: 2,
              column: 2,
              mobilewidth: '20%',
              tabletwidth: '48%',
              computerwidth: '48%',
              gridname: 'pricingtablefeatures',
              alignment: 'center' as const,
            },
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
            tabletwidth: '48%',
            computerwidth: '48%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as const,
          },
          tiedtopackage: {
            tiedtopackages: ['true', 'true', 'true'],
            columnconfig: {
              row: 3,
              column: 2,
              mobilewidth: '20%',
              tabletwidth: '48%',
              computerwidth: '48%',
              gridname: 'pricingtablefeatures',
              alignment: 'center' as const,
            },
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
        tabletwidth: '48%',
        computerwidth: '48%',
        gridname: 'pricingtablefeatures',
        alignment: 'left' as const,
      },
      tiedtopackage: {
        tiedtopackages: ['true', 'true', 'true'],
        columnconfig: {
          row: 4,
          column: 2,
          mobilewidth: '20%',
          tabletwidth: '48%',
          computerwidth: '48%',
          gridname: 'pricingtablefeatures',
          alignment: 'center' as const,
        },
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
            computerwidth: '48%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as const,
          },
          tiedtopackage: {
            tiedtopackages: ['true', 'true', 'true'],
            columnconfig: {
              row: 5,
              column: 2,
              mobilewidth: '20%',
              tabletwidth: '48%',
              computerwidth: '48%',
              gridname: 'pricingtablefeatures',
              alignment: 'center' as const,
            },
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
            tabletwidth: '48%',
            computerwidth: '48%',
            gridname: 'pricingtablefeatures',
            alignment: 'left' as const,
          },
          tiedtopackage: {
            tiedtopackages: ['true', 'true', 'true'],
            columnconfig: {
              row: 6,
              column: 2,
              mobilewidth: '20%',
              tabletwidth: '48%',
              computerwidth: '48%',
              gridname: 'pricingtablefeatures',
              alignment: 'center' as const,
            },
          },
        },
      ],
    },
  ],
  // Configuration for button columns
  buttoncolumns: {
    buttontexts: ['Learn More', 'Learn More', 'Learn More'],
    buttonlinks: [
      '#goobs-frontend-unlimited',
      '#goobs-frontend-unlimited',
      '#goobs-frontend-unlimited',
    ],
    columnconfig: {
      row: 7,
      column: 1,
      mobilewidth: '100%',
      margintop: {
        xs: 2,
        sm: 2,
        md: 2,
        ms: 2,
        ml: 2,
        lg: 2,
        xl: 2,
      },
      marginbottom: {
        xs: 1,
        sm: 1,
        md: 1,
        ms: 1,
        ml: 1,
        lg: 1,
        xl: 1,
      },
      marginright: {
        xs: 1,
        sm: 1,
        md: 1,
        ms: 1,
        ml: 1,
        lg: 1,
        xl: 1,
      },
      marginleft: {
        xs: 1,
        sm: 1,
        md: 1,
        ms: 1,
        ml: 1,
        lg: 1,
        xl: 1,
      },
      tabletwidth: '100%',
      computerwidth: '48%',
      gridname: 'pricingtablefeatures',
      alignment: 'center' as const,
    },
  },
}

export default defaultConfig
