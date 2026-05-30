'use client'

import ContentSection from '../../Content'
import { ProjectBoardProps } from '../../ProjectBoard/types'
import cssStyles from './FormProjectBoard.module.css'

// Sacred glyphs removed

export interface FormProjectBoardProps {
  title: string
  description: string
  projectboard: ProjectBoardProps
  sacredtheme?: boolean
}

function FormProjectBoard({
  title,
  description,
  projectboard,
  sacredtheme = true,
}: FormProjectBoardProps) {
  // Theme variant as a data-attribute, mirroring the goobs Card/DataGrid house
  // pattern. The boolean `sacredtheme` maps to the canonical 'sacred' | 'light'.
  const theme: 'sacred' | 'light' = sacredtheme ? 'sacred' : 'light'

  return (
    <div className={cssStyles.container} data-theme={theme}>
      {sacredtheme && (
        <>
          <div className={cssStyles.topShimmer} />
          <div className={cssStyles.bottomShimmer} />
        </>
      )}

      <div className={cssStyles.titleContainer} data-theme={theme}>
        <div className={cssStyles.title} data-theme={theme}>
          {title}
        </div>
        <div className={cssStyles.description} data-theme={theme}>
          {description}
        </div>

        {sacredtheme && <div className={cssStyles.underline} />}
      </div>

      <div className={cssStyles.projectBoardContainer} data-theme={theme}>
        <ContentSection
          grids={[
            {
              projectboard: projectboard,
            },
          ]}
          sacredtheme={sacredtheme}
        />
      </div>
    </div>
  )
}

export default FormProjectBoard
