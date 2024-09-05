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
      marginleft: 3,
      marginbottom: 1,
      mobilewidth: '100%',
      tabletwidth: '100%',
      computerwidth: '100%',
    },
  },
  // Configuration for package columns
  packagecolumns: {
    packagenames: ['ThothOS', 'ThothOS Pro', 'ThothOS Enterprise'],
    columnconfig: {
      row: 1,
      column: 2,
      gridname: 'pricingtableheader',
      alignment: 'center' as Alignment,
      mobilewidth: '80%',
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
      alignment: 'center' as Alignment,
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
      alignment: 'center' as Alignment,
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
        tabletwidth: '48%',
        computerwidth: '48%',
        gridname: 'pricingtablefeatures',
        alignment: 'left' as Alignment,
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
          alignment: 'center' as Alignment,
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
            alignment: 'left' as Alignment,
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
              alignment: 'center' as Alignment,
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
            alignment: 'left' as Alignment,
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
              alignment: 'center' as Alignment,
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
        alignment: 'left' as Alignment,
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
          alignment: 'center' as Alignment,
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
            alignment: 'left' as Alignment,
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
              alignment: 'center' as Alignment,
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
            alignment: 'left' as Alignment,
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
              alignment: 'center' as Alignment,
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
      column: 2,
      mobilewidth: '100%',
      marginbottom: 1,
      marginright: 1,
      tabletwidth: '100%',
      computerwidth: '48%',
      gridname: 'pricingtablefeatures',
      alignment: 'center' as Alignment,
    },
  },
}

export default defaultConfig
