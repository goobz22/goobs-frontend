export interface ValidationProps {
  identifier?: string;
  value?: string | boolean;
  tokenType?: 'registered' | 'verified' | 'loggedIn';
}

export interface HelperFooterMessage extends ValidationProps {
  status?: 'error' | 'success';
  statusMessage?: string;
  helperFooterFunction?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<{
    status?: 'error' | 'success';
    statusMessage?: string;
  } | undefined>;
}

export interface SpreadErrorMessage extends HelperFooterMessage {
  spread?: 'ontoAncestors' | 'ontoDescendants' | 'ontoAll' | 'ontoNone' | 'ontoSubmit';
  spreadMessage?: string;
}

export interface IconProps {
  status: 'error' | 'success';
}