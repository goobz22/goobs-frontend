import React, { useRef, useEffect } from 'react'
import { Box } from '@mui/material'
import CustomButton from '../../components/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import hljs from 'highlight.js'

/**
 * Props for the CodeCopy component.
 */
export interface CodeCopyProps {
  /** The code to be displayed and copied */
  code: string
  /** The programming language of the code (for syntax highlighting) */
  language: string
}

/**
 * CodeCopy component renders a code block with syntax highlighting and a copy button.
 * It uses highlight.js for syntax highlighting and provides a mechanism to copy the code to clipboard.
 */
const CodeCopy: React.FC<CodeCopyProps> = ({ code, language }) => {
  /** Reference to the code element for applying syntax highlighting */
  const codeRef = useRef<HTMLElement>(null)

  /**
   * Effect to apply syntax highlighting when the component mounts or when code/language changes
   */
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  /**
   * Handles the copying of code to clipboard
   */
  const handleCopy = () => {
    const codeElement = codeRef.current
    if (codeElement) {
      const textArea = document.createElement('textarea')
      textArea.value = codeElement.innerText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
      console.log('Code copied to clipboard')
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1,
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* Header with Copy Button */}
      <Box
        sx={{
          height: '40px',
          width: '100%',
          backgroundColor: 'grey.300',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: 2,
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
        }}
      >
        <Box sx={{ marginLeft: 'auto' }}>
          <CustomButton
            text="Copy Code"
            variant="text"
            icon={<ContentCopyIcon />}
            iconlocation="left"
            fontcolor="black"
            iconcolor="black"
            onClick={handleCopy}
          />
        </Box>
      </Box>

      {/* Code Block */}
      <Box
        sx={{
          backgroundColor: 'black',
          color: 'white',
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <pre
          style={{
            backgroundColor: 'black',
            color: 'white',
            margin: 0,
            flexGrow: 1,
            paddingTop: 0,
            paddingBottom: 16,
          }}
        >
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </Box>
    </Box>
  )
}

export default CodeCopy
