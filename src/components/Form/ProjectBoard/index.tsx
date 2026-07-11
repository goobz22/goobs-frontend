'use client'

import type { ElementType } from 'react'
import ContentSection from '../../Content'
import { ProjectBoardProps } from '../../ProjectBoard/types'
import cssStyles from './FormProjectBoard.module.css'

// Sacred glyphs removed

export interface FormProjectBoardProps {
  title: string
  /**
   * Semantic level for the `title` heading — the title renders as a real
   * `<h1>`–`<h6>` element (not a styled `<div>`) so screen-reader users can
   * jump to it by heading navigation and crawlers see a genuine heading. Set
   * this to match the board's position in the surrounding document outline
   * (e.g. `3` when it sits inside an `<h2>` section). Default `2`.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  description: string
  projectboard: ProjectBoardProps
  sacredtheme?: boolean
}

function FormProjectBoard({
  title,
  headingLevel = 2,
  description,
  projectboard,
  sacredtheme = true,
}: FormProjectBoardProps) {
  // Theme variant as a data-attribute, mirroring the goobs Card/DataGrid house
  // pattern. The boolean `sacredtheme` maps to the canonical 'sacred' | 'light'.
  const theme: 'sacred' | 'light' = sacredtheme ? 'sacred' : 'light'

  // The title is the section heading — render it as a genuine `<h1>`–`<h6>`
  // (never a styled <div>) so it is reachable by heading navigation and is a
  // real heading in the SSR'd/crawled HTML. `.title` resets the default heading
  // margin, so the visual output is unchanged.
  const HeadingTag = `h${headingLevel}` as ElementType

  return (
    <div className={cssStyles.container} data-theme={theme}>
      {sacredtheme && (
        <>
          <div className={cssStyles.topShimmer} aria-hidden="true" />
          <div className={cssStyles.bottomShimmer} aria-hidden="true" />
        </>
      )}

      <div className={cssStyles.titleContainer} data-theme={theme}>
        <HeadingTag className={cssStyles.title} data-theme={theme}>
          {title}
        </HeadingTag>
        <p className={cssStyles.description} data-theme={theme}>
          {description}
        </p>

        {sacredtheme && <div className={cssStyles.underline} aria-hidden="true" />}
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
