import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

// Import all 270 icons
import AccessTimeIcon from './AccessTime'
import AccountBalanceIcon from './AccountBalance'
import AccountBalanceWalletIcon from './AccountBalanceWallet'
import AccountTreeIcon from './AccountTree'
import AddIcon from './Add'
import AddCircleIcon from './AddCircle'
import AddCircleOutlineIcon from './AddCircleOutline'
import AddPhotoAlternateIcon from './AddPhotoAlternate'
import AddShoppingCartIcon from './AddShoppingCart'
import AddTaskIcon from './AddTask'
import AdminPanelSettingsIcon from './AdminPanelSettings'
import AnalyticsIcon from './Analytics'
import AnimationIcon from './Animation'
import ApartmentIcon from './Apartment'
import AppleIcon from './Apple'
import ArrowBackIcon from './ArrowBack'
import ArrowDropDownIcon from './ArrowDropDown'
import ArrowDropDownCircleIcon from './ArrowDropDownCircle'
import ArrowDropUpIcon from './ArrowDropUp'
import ArrowForwardIcon from './ArrowForward'
import ArticleIcon from './Article'
import AssessmentIcon from './Assessment'
import AssignmentIcon from './Assignment'
import AttachFileIcon from './AttachFile'
import AttachMoneyIcon from './AttachMoney'
import AttachmentIcon from './Attachment'
import AutoAwesomeIcon from './AutoAwesome'
import AutoGraphIcon from './AutoGraph'
import AutorenewIcon from './Autorenew'
import BankIcon from './Bank'
import BarChartIcon from './BarChart'
import BlockIcon from './Block'
import BugReportIcon from './BugReport'
import BuildIcon from './Build'
import BusinessIcon from './Business'
import BusinessCenterIcon from './BusinessCenter'
import CalculateIcon from './Calculate'
import CalendarIcon from './Calendar'
import CalendarMonthIcon from './CalendarMonth'
import CalendarTodayIcon from './CalendarToday'
import CampaignIcon from './Campaign'
import CancelIcon from './Cancel'
import CardGiftcardIcon from './CardGiftcard'
import CardMembershipIcon from './CardMembership'
import CategoryIcon from './Category'
import ChatIcon from './Chat'
import CheckIcon from './Check'
import CheckBoxIcon from './CheckBox'
import CheckCircleIcon from './CheckCircle'
import CheckCircleOutlineIcon from './CheckCircleOutline'
import ChevronLeftIcon from './ChevronLeft'
import ChevronRightIcon from './ChevronRight'
import CircleOutlineIcon from './CircleOutline'
import ClearIcon from './Clear'
import CloseIcon from './Close'
import CloudSyncIcon from './CloudSync'
import CloudUploadIcon from './CloudUpload'
import CodeIcon from './Code'
import CompareArrowsIcon from './CompareArrows'
import ConstructionIcon from './Construction'
import ContactsIcon from './Contacts'
import ContentCopyIcon from './ContentCopy'
import ContractIcon from './Contract'
import CreateIcon from './Create'
import CreateNewFolderIcon from './CreateNewFolder'
import CreditCardIcon from './CreditCard'
import CreditCardOffIcon from './CreditCardOff'
import CurrencyExchangeIcon from './CurrencyExchange'
import DashboardIcon from './Dashboard'
import DateRangeIcon from './DateRange'
import DeleteIcon from './Delete'
import DescriptionIcon from './Description'
import DesktopWindowsIcon from './DesktopWindows'
import DeviceHubIcon from './DeviceHub'
import DevicesIcon from './Devices'
import DnsIcon from './Dns'
import DomainIcon from './Domain'
import DownloadIcon from './Download'
import DragIcon from './Drag'
import DragIndicatorIcon from './DragIndicator'
import DuplicateIcon from './Duplicate'
import EditIcon from './Edit'
import EmailIcon from './Email'
import EmojiEventsIcon from './EmojiEvents'
import EngineeringIcon from './Engineering'
import ErrorIcon from './Error'
import ErrorOutlineIcon from './ErrorOutline'
import EventIcon from './Event'
import EventAvailableIcon from './EventAvailable'
import EventBusyIcon from './EventBusy'
import ExpandLessIcon from './ExpandLess'
import ExpandMoreIcon from './ExpandMore'
import ExtensionIcon from './Extension'
import FavoriteIcon from './Favorite'
import FavoriteBorderIcon from './FavoriteBorder'
import FeedbackIcon from './Feedback'
import FileCopyIcon from './FileCopy'
import FilingIcon from './Filing'
import FilterListIcon from './FilterList'
import FingerprintIcon from './Fingerprint'
import FirstPageIcon from './FirstPage'
import FormatAlignCenterIcon from './FormatAlignCenter'
import FormatAlignLeftIcon from './FormatAlignLeft'
import FormatAlignRightIcon from './FormatAlignRight'
import FormatBoldIcon from './FormatBold'
import FormatItalicIcon from './FormatItalic'
import FormatListBulletedIcon from './FormatListBulleted'
import FormatListNumberedIcon from './FormatListNumbered'
import FormatUnderlinedIcon from './FormatUnderlined'
import GavelIcon from './Gavel'
import GestureIcon from './Gesture'
import GoogleIcon from './Google'
import GridViewIcon from './GridView'
import GroupIcon from './Group'
import GroupWorkIcon from './GroupWork'
import GroupsIcon from './Groups'
import HandshakeIcon from './Handshake'
import HelpIcon from './Help'
import HistoryIcon from './History'
import HomeIcon from './Home'
import HomeWorkIcon from './HomeWork'
import HourglassEmptyIcon from './HourglassEmpty'
import HubIcon from './Hub'
import ImageIcon from './Image'
import InfoIcon from './Info'
import InfoOutlineIcon from './InfoOutline'
import InsightsIcon from './Insights'
import IntegrationInstructionsIcon from './IntegrationInstructions'
import InventoryIcon from './Inventory'
import KeyboardArrowDownIcon from './KeyboardArrowDown'
import KeyboardArrowLeftIcon from './KeyboardArrowLeft'
import KeyboardArrowRightIcon from './KeyboardArrowRight'
import KeyboardReturnIcon from './KeyboardReturn'
import LanIcon from './Lan'
import LastPageIcon from './LastPage'
import LaunchIcon from './Launch'
import LayersIcon from './Layers'
import LinkIcon from './Link'
import ListAltIcon from './ListAlt'
import LocalGasStationIcon from './LocalGasStation'
import LocalOfferIcon from './LocalOffer'
import LocalShippingIcon from './LocalShipping'
import LocationCityIcon from './LocationCity'
import LocationIcon from './Location'
import LocationOnIcon from './LocationOn'
import LocationSearchingIcon from './LocationSearching'
import LockIcon from './Lock'
import LoginIcon from './Login'
import LogoutRoundedIcon from './LogoutRounded'
import LooksFourIcon from './LooksFour'
import LooksOneIcon from './LooksOne'
import LooksThreeIcon from './LooksThree'
import LooksTwoIcon from './LooksTwo'
import LoopIcon from './Loop'
import LowPriorityIcon from './LowPriority'
import LoyaltyIcon from './Loyalty'
import MapIcon from './Map'
import MenuIcon from './Menu'
import MenuBookIcon from './MenuBook'
import MonetizationOnIcon from './MonetizationOn'
import MoneyIcon from './Money'
import MoreHorizIcon from './MoreHoriz'
import MoreVertIcon from './MoreVert'
import MouseIcon from './Mouse'
import NavigationIcon from './Navigation'
import NetworkCheckIcon from './NetworkCheck'
import NotificationActiveIcon from './NotificationActive'
import NotificationImportantIcon from './NotificationImportant'
import NotificationsIcon from './Notifications'
import OutlookIcon from './Outlook'
import PauseIcon from './Pause'
import PaymentIcon from './Payment'
import PdfIcon from './Pdf'
import PendingActionsIcon from './PendingActions'
import PeopleIcon from './People'
import PersonIcon from './Person'
import PersonAddIcon from './PersonAdd'
import PersonOutlineIcon from './PersonOutline'
import PhoneIcon from './Phone'
import PlayArrowIcon from './PlayArrow'
import PlaylistAddCheckIcon from './PlaylistAddCheck'
import PointOfSaleIcon from './PointOfSale'
import PolicyIcon from './Policy'
import PostAddIcon from './PostAdd'
import PrecisionManufacturingIcon from './PrecisionManufacturing'
import PreviewIcon from './Preview'
import PrintIcon from './Print'
import PriorityHighIcon from './PriorityHigh'
import PsychologyIcon from './Psychology'
import PublicIcon from './Public'
import QrCodeIcon from './QrCode'
import QrCodeScannerIcon from './QrCodeScanner'
import RadioButtonCheckedIcon from './RadioButtonChecked'
import RateReviewIcon from './RateReview'
import ReceiptIcon from './Receipt'
import RedoIcon from './Redo'
import RefreshIcon from './Refresh'
import RemoveIcon from './Remove'
import RepeatIcon from './Repeat'
import ReportProblemIcon from './ReportProblem'
import RequestQuoteIcon from './RequestQuote'
import RestoreIcon from './Restore'
import RouterIcon from './Router'
import SaveIcon from './Save'
import ScheduleIcon from './Schedule'
import SchoolIcon from './School'
import ScreenRotationIcon from './ScreenRotation'
import SearchIcon from './Search'
import SecurityIcon from './Security'
import SendIcon from './Send'
import SettingsIcon from './Settings'
import ShieldIcon from './Shield'
import ShoppingBasketIcon from './ShoppingBasket'
import ShowChartIcon from './ShowChart'
import ShowHideEyeIcon from './ShowHideEye'
import SkipNextIcon from './SkipNext'
import SmartButtonIcon from './SmartButton'
import SmartphoneIcon from './Smartphone'
import SmsIcon from './Sms'
import SortIcon from './Sort'
import SpaIcon from './Spa'
import SpeedIcon from './Speed'
import StarIcon from './Star'
import StarBorderIcon from './StarBorder'
import StopIcon from './Stop'
import StorageIcon from './Storage'
import StoreIcon from './Store'
import StoreMallDirectoryIcon from './StoreMallDirectory'
import StrikethroughSIcon from './StrikethroughS'
import SupervisedUserCircleIcon from './SupervisedUserCircle'
import SupportIcon from './Support'
import SyncIcon from './Sync'
import TableIcon from './Table'
import TabletIcon from './Tablet'
import TemplateIcon from './Template'
import TextFieldsIcon from './TextFields'
import ThumbUpIcon from './ThumbUp'
import TimelineIcon from './Timeline'
import TimerIcon from './Timer'
import TransferIcon from './Transfer'
import TrendingDownIcon from './TrendingDown'
import TrendingUpIcon from './TrendingUp'
import UndoIcon from './Undo'
import VerifiedUserIcon from './VerifiedUser'
import VideoLibraryIcon from './VideoLibrary'
import VideocamIcon from './Videocam'
import ViewCompactIcon from './ViewCompact'
import ViewHeadlineIcon from './ViewHeadline'
import ViewIcon from './View'
import ViewListIcon from './ViewList'
import ViewModuleIcon from './ViewModule'
import ViewSidebarIcon from './ViewSidebar'
import VisibilityIcon from './Visibility'
import VisibilityOffIcon from './VisibilityOff'
import VpnKeyIcon from './VpnKey'
import VpnLockIcon from './VpnLock'
import WarningIcon from './Warning'
import WarningAmberIcon from './WarningAmber'
import WaterDropIcon from './WaterDrop'
import WebIcon from './Web'
import WidgetsIcon from './Widgets'
import WifiIcon from './Wifi'
import WifiOffIcon from './WifiOff'
import WorkIcon from './Work'
import WorkspacePremiumIcon from './WorkspacePremium'

const meta: Meta = {
  title: 'Icons/All Icons Showcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive showcase of all 270 icons with Light, Dark, and Sacred theming options.',
      },
    },
  },
}

export default meta

type Story = StoryObj

// All 270 icons with centralized theme support
const allIcons = [
  { name: 'AccessTime', component: AccessTimeIcon },
  { name: 'AccountBalance', component: AccountBalanceIcon },
  { name: 'AccountBalanceWallet', component: AccountBalanceWalletIcon },
  { name: 'AccountTree', component: AccountTreeIcon },
  { name: 'Add', component: AddIcon },
  { name: 'AddCircle', component: AddCircleIcon },
  { name: 'AddCircleOutline', component: AddCircleOutlineIcon },
  { name: 'AddPhotoAlternate', component: AddPhotoAlternateIcon },
  { name: 'AddShoppingCart', component: AddShoppingCartIcon },
  { name: 'AddTask', component: AddTaskIcon },
  { name: 'AdminPanelSettings', component: AdminPanelSettingsIcon },
  { name: 'Analytics', component: AnalyticsIcon },
  { name: 'Animation', component: AnimationIcon },
  { name: 'Apartment', component: ApartmentIcon },
  { name: 'Apple', component: AppleIcon },
  { name: 'ArrowBack', component: ArrowBackIcon },
  { name: 'ArrowDropDown', component: ArrowDropDownIcon },
  { name: 'ArrowDropDownCircle', component: ArrowDropDownCircleIcon },
  { name: 'ArrowDropUp', component: ArrowDropUpIcon },
  { name: 'ArrowForward', component: ArrowForwardIcon },
  { name: 'Article', component: ArticleIcon },
  { name: 'Assessment', component: AssessmentIcon },
  { name: 'Assignment', component: AssignmentIcon },
  { name: 'AttachFile', component: AttachFileIcon },
  { name: 'AttachMoney', component: AttachMoneyIcon },
  { name: 'Attachment', component: AttachmentIcon },
  { name: 'AutoAwesome', component: AutoAwesomeIcon },
  { name: 'AutoGraph', component: AutoGraphIcon },
  { name: 'Autorenew', component: AutorenewIcon },
  { name: 'Bank', component: BankIcon },
  { name: 'BarChart', component: BarChartIcon },
  { name: 'Block', component: BlockIcon },
  { name: 'BugReport', component: BugReportIcon },
  { name: 'Build', component: BuildIcon },
  { name: 'Business', component: BusinessIcon },
  { name: 'BusinessCenter', component: BusinessCenterIcon },
  { name: 'Calculate', component: CalculateIcon },
  { name: 'Calendar', component: CalendarIcon },
  { name: 'CalendarMonth', component: CalendarMonthIcon },
  { name: 'CalendarToday', component: CalendarTodayIcon },
  { name: 'Campaign', component: CampaignIcon },
  { name: 'Cancel', component: CancelIcon },
  { name: 'CardGiftcard', component: CardGiftcardIcon },
  { name: 'CardMembership', component: CardMembershipIcon },
  { name: 'Category', component: CategoryIcon },
  { name: 'Chat', component: ChatIcon },
  { name: 'Check', component: CheckIcon },
  { name: 'CheckBox', component: CheckBoxIcon },
  { name: 'CheckCircle', component: CheckCircleIcon },
  { name: 'CheckCircleOutline', component: CheckCircleOutlineIcon },
  { name: 'ChevronLeft', component: ChevronLeftIcon },
  { name: 'ChevronRight', component: ChevronRightIcon },
  { name: 'CircleOutline', component: CircleOutlineIcon },
  { name: 'Clear', component: ClearIcon },
  { name: 'Close', component: CloseIcon },
  { name: 'CloudSync', component: CloudSyncIcon },
  { name: 'CloudUpload', component: CloudUploadIcon },
  { name: 'Code', component: CodeIcon },
  { name: 'CompareArrows', component: CompareArrowsIcon },
  { name: 'Construction', component: ConstructionIcon },
  { name: 'Contacts', component: ContactsIcon },
  { name: 'ContentCopy', component: ContentCopyIcon },
  { name: 'Contract', component: ContractIcon },
  { name: 'Create', component: CreateIcon },
  { name: 'CreateNewFolder', component: CreateNewFolderIcon },
  { name: 'CreditCard', component: CreditCardIcon },
  { name: 'CreditCardOff', component: CreditCardOffIcon },
  { name: 'CurrencyExchange', component: CurrencyExchangeIcon },
  { name: 'Dashboard', component: DashboardIcon },
  { name: 'DateRange', component: DateRangeIcon },
  { name: 'Delete', component: DeleteIcon },
  { name: 'Description', component: DescriptionIcon },
  { name: 'DesktopWindows', component: DesktopWindowsIcon },
  { name: 'DeviceHub', component: DeviceHubIcon },
  { name: 'Devices', component: DevicesIcon },
  { name: 'Dns', component: DnsIcon },
  { name: 'Domain', component: DomainIcon },
  { name: 'Download', component: DownloadIcon },
  { name: 'Drag', component: DragIcon },
  { name: 'DragIndicator', component: DragIndicatorIcon },
  { name: 'Duplicate', component: DuplicateIcon },
  { name: 'Edit', component: EditIcon },
  { name: 'Email', component: EmailIcon },
  { name: 'EmojiEvents', component: EmojiEventsIcon },
  { name: 'Engineering', component: EngineeringIcon },
  { name: 'Error', component: ErrorIcon },
  { name: 'ErrorOutline', component: ErrorOutlineIcon },
  { name: 'Event', component: EventIcon },
  { name: 'EventAvailable', component: EventAvailableIcon },
  { name: 'EventBusy', component: EventBusyIcon },
  { name: 'ExpandLess', component: ExpandLessIcon },
  { name: 'ExpandMore', component: ExpandMoreIcon },
  { name: 'Extension', component: ExtensionIcon },
  { name: 'Favorite', component: FavoriteIcon },
  { name: 'FavoriteBorder', component: FavoriteBorderIcon },
  { name: 'Feedback', component: FeedbackIcon },
  { name: 'FileCopy', component: FileCopyIcon },
  { name: 'Filing', component: FilingIcon },
  { name: 'FilterList', component: FilterListIcon },
  { name: 'Fingerprint', component: FingerprintIcon },
  { name: 'FirstPage', component: FirstPageIcon },
  { name: 'FormatAlignCenter', component: FormatAlignCenterIcon },
  { name: 'FormatAlignLeft', component: FormatAlignLeftIcon },
  { name: 'FormatAlignRight', component: FormatAlignRightIcon },
  { name: 'FormatBold', component: FormatBoldIcon },
  { name: 'FormatItalic', component: FormatItalicIcon },
  { name: 'FormatListBulleted', component: FormatListBulletedIcon },
  { name: 'FormatListNumbered', component: FormatListNumberedIcon },
  { name: 'FormatUnderlined', component: FormatUnderlinedIcon },
  { name: 'Gavel', component: GavelIcon },
  { name: 'Gesture', component: GestureIcon },
  { name: 'Google', component: GoogleIcon },
  { name: 'GridView', component: GridViewIcon },
  { name: 'Group', component: GroupIcon },
  { name: 'GroupWork', component: GroupWorkIcon },
  { name: 'Groups', component: GroupsIcon },
  { name: 'Handshake', component: HandshakeIcon },
  { name: 'Help', component: HelpIcon },
  { name: 'History', component: HistoryIcon },
  { name: 'Home', component: HomeIcon },
  { name: 'HomeWork', component: HomeWorkIcon },
  { name: 'HourglassEmpty', component: HourglassEmptyIcon },
  { name: 'Hub', component: HubIcon },
  { name: 'Image', component: ImageIcon },
  { name: 'Info', component: InfoIcon },
  { name: 'InfoOutline', component: InfoOutlineIcon },
  { name: 'Insights', component: InsightsIcon },
  { name: 'IntegrationInstructions', component: IntegrationInstructionsIcon },
  { name: 'Inventory', component: InventoryIcon },
  { name: 'KeyboardArrowDown', component: KeyboardArrowDownIcon },
  { name: 'KeyboardArrowLeft', component: KeyboardArrowLeftIcon },
  { name: 'KeyboardArrowRight', component: KeyboardArrowRightIcon },
  { name: 'KeyboardReturn', component: KeyboardReturnIcon },
  { name: 'Lan', component: LanIcon },
  { name: 'LastPage', component: LastPageIcon },
  { name: 'Launch', component: LaunchIcon },
  { name: 'Layers', component: LayersIcon },
  { name: 'Link', component: LinkIcon },
  { name: 'ListAlt', component: ListAltIcon },
  { name: 'LocalGasStation', component: LocalGasStationIcon },
  { name: 'LocalOffer', component: LocalOfferIcon },
  { name: 'LocalShipping', component: LocalShippingIcon },
  { name: 'LocationCity', component: LocationCityIcon },
  { name: 'Location', component: LocationIcon },
  { name: 'LocationOn', component: LocationOnIcon },
  { name: 'LocationSearching', component: LocationSearchingIcon },
  { name: 'Lock', component: LockIcon },
  { name: 'Login', component: LoginIcon },
  { name: 'LogoutRounded', component: LogoutRoundedIcon },
  { name: 'LooksFour', component: LooksFourIcon },
  { name: 'LooksOne', component: LooksOneIcon },
  { name: 'LooksThree', component: LooksThreeIcon },
  { name: 'LooksTwo', component: LooksTwoIcon },
  { name: 'Loop', component: LoopIcon },
  { name: 'LowPriority', component: LowPriorityIcon },
  { name: 'Loyalty', component: LoyaltyIcon },
  { name: 'Map', component: MapIcon },
  { name: 'Menu', component: MenuIcon },
  { name: 'MenuBook', component: MenuBookIcon },
  { name: 'MonetizationOn', component: MonetizationOnIcon },
  { name: 'Money', component: MoneyIcon },
  { name: 'MoreHoriz', component: MoreHorizIcon },
  { name: 'MoreVert', component: MoreVertIcon },
  { name: 'Mouse', component: MouseIcon },
  { name: 'Navigation', component: NavigationIcon },
  { name: 'NetworkCheck', component: NetworkCheckIcon },
  { name: 'NotificationActive', component: NotificationActiveIcon },
  { name: 'NotificationImportant', component: NotificationImportantIcon },
  { name: 'Notifications', component: NotificationsIcon },
  { name: 'Outlook', component: OutlookIcon },
  { name: 'Pause', component: PauseIcon },
  { name: 'Payment', component: PaymentIcon },
  { name: 'Pdf', component: PdfIcon },
  { name: 'PendingActions', component: PendingActionsIcon },
  { name: 'People', component: PeopleIcon },
  { name: 'Person', component: PersonIcon },
  { name: 'PersonAdd', component: PersonAddIcon },
  { name: 'PersonOutline', component: PersonOutlineIcon },
  { name: 'Phone', component: PhoneIcon },
  { name: 'PlayArrow', component: PlayArrowIcon },
  { name: 'PlaylistAddCheck', component: PlaylistAddCheckIcon },
  { name: 'PointOfSale', component: PointOfSaleIcon },
  { name: 'Policy', component: PolicyIcon },
  { name: 'PostAdd', component: PostAddIcon },
  { name: 'PrecisionManufacturing', component: PrecisionManufacturingIcon },
  { name: 'Preview', component: PreviewIcon },
  { name: 'Print', component: PrintIcon },
  { name: 'PriorityHigh', component: PriorityHighIcon },
  { name: 'Psychology', component: PsychologyIcon },
  { name: 'Public', component: PublicIcon },
  { name: 'QrCode', component: QrCodeIcon },
  { name: 'QrCodeScanner', component: QrCodeScannerIcon },
  { name: 'RadioButtonChecked', component: RadioButtonCheckedIcon },
  { name: 'RateReview', component: RateReviewIcon },
  { name: 'Receipt', component: ReceiptIcon },
  { name: 'Redo', component: RedoIcon },
  { name: 'Refresh', component: RefreshIcon },
  { name: 'Remove', component: RemoveIcon },
  { name: 'Repeat', component: RepeatIcon },
  { name: 'ReportProblem', component: ReportProblemIcon },
  { name: 'RequestQuote', component: RequestQuoteIcon },
  { name: 'Restore', component: RestoreIcon },
  { name: 'Router', component: RouterIcon },
  { name: 'Save', component: SaveIcon },
  { name: 'Schedule', component: ScheduleIcon },
  { name: 'School', component: SchoolIcon },
  { name: 'ScreenRotation', component: ScreenRotationIcon },
  { name: 'Search', component: SearchIcon },
  { name: 'Security', component: SecurityIcon },
  { name: 'Send', component: SendIcon },
  { name: 'Settings', component: SettingsIcon },
  { name: 'Shield', component: ShieldIcon },
  { name: 'ShoppingBasket', component: ShoppingBasketIcon },
  { name: 'ShowChart', component: ShowChartIcon },
  { name: 'ShowHideEye', component: ShowHideEyeIcon },
  { name: 'SkipNext', component: SkipNextIcon },
  { name: 'SmartButton', component: SmartButtonIcon },
  { name: 'Smartphone', component: SmartphoneIcon },
  { name: 'Sms', component: SmsIcon },
  { name: 'Sort', component: SortIcon },
  { name: 'Spa', component: SpaIcon },
  { name: 'Speed', component: SpeedIcon },
  { name: 'Star', component: StarIcon },
  { name: 'StarBorder', component: StarBorderIcon },
  { name: 'Stop', component: StopIcon },
  { name: 'Storage', component: StorageIcon },
  { name: 'Store', component: StoreIcon },
  { name: 'StoreMallDirectory', component: StoreMallDirectoryIcon },
  { name: 'StrikethroughS', component: StrikethroughSIcon },
  { name: 'SupervisedUserCircle', component: SupervisedUserCircleIcon },
  { name: 'Support', component: SupportIcon },
  { name: 'Sync', component: SyncIcon },
  { name: 'Table', component: TableIcon },
  { name: 'Tablet', component: TabletIcon },
  { name: 'Template', component: TemplateIcon },
  { name: 'TextFields', component: TextFieldsIcon },
  { name: 'ThumbUp', component: ThumbUpIcon },
  { name: 'Timeline', component: TimelineIcon },
  { name: 'Timer', component: TimerIcon },
  { name: 'Transfer', component: TransferIcon },
  { name: 'TrendingDown', component: TrendingDownIcon },
  { name: 'TrendingUp', component: TrendingUpIcon },
  { name: 'Undo', component: UndoIcon },
  { name: 'VerifiedUser', component: VerifiedUserIcon },
  { name: 'VideoLibrary', component: VideoLibraryIcon },
  { name: 'Videocam', component: VideocamIcon },
  { name: 'ViewCompact', component: ViewCompactIcon },
  { name: 'ViewHeadline', component: ViewHeadlineIcon },
  { name: 'View', component: ViewIcon },
  { name: 'ViewList', component: ViewListIcon },
  { name: 'ViewModule', component: ViewModuleIcon },
  { name: 'ViewSidebar', component: ViewSidebarIcon },
  { name: 'Visibility', component: VisibilityIcon },
  { name: 'VisibilityOff', component: VisibilityOffIcon },
  { name: 'VpnKey', component: VpnKeyIcon },
  { name: 'VpnLock', component: VpnLockIcon },
  { name: 'Warning', component: WarningIcon },
  { name: 'WarningAmber', component: WarningAmberIcon },
  { name: 'WaterDrop', component: WaterDropIcon },
  { name: 'Web', component: WebIcon },
  { name: 'Widgets', component: WidgetsIcon },
  { name: 'Wifi', component: WifiIcon },
  { name: 'WifiOff', component: WifiOffIcon },
  { name: 'Work', component: WorkIcon },
  { name: 'WorkspacePremium', component: WorkspacePremiumIcon },
]

const IconShowcase: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center', color: '#333' }}>
        🎨 Complete Icons Gallery: Light, Dark & Sacred Themes
      </h1>

      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Showcasing all {allIcons.length} icons with the centralized theme
          system
        </p>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2
          style={{
            marginBottom: '20px',
            color: '#2d3748',
            borderBottom: '2px solid #4f46e5',
            paddingBottom: '10px',
          }}
        >
          ✨ All Icons ({allIcons.length} Total)
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {allIcons.map(({ name, component: IconComponent }) => (
            <div
              key={name}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3
                style={{
                  marginBottom: '15px',
                  color: '#4a5568',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {name}
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {/* Light Theme */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    Light
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#f7fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '60px',
                    }}
                  >
                    <IconComponent styles={{ theme: 'light' }} />
                  </div>
                </div>

                {/* Dark Theme */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    Dark
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '60px',
                    }}
                  >
                    <IconComponent styles={{ theme: 'dark' }} />
                  </div>
                </div>

                {/* Sacred Theme */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#d4af37',
                      fontWeight: '500',
                    }}
                  >
                    Sacred
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      border: '1px solid #ffd700',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '60px',
                    }}
                  >
                    <IconComponent styles={{ theme: 'sacred' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Instructions */}
      <div
        style={{
          marginTop: '60px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #0284c7',
        }}
      >
        <h3 style={{ color: '#0c4a6e', marginBottom: '15px' }}>
          💡 Usage Instructions
        </h3>
        <div style={{ color: '#0369a1', fontSize: '14px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Light Theme (Default):</strong>{' '}
            <code>{'<IconComponent />'}</code> or{' '}
            <code>{'<IconComponent styles={{ theme: "light" }} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Dark Theme:</strong>{' '}
            <code>{'<IconComponent styles={{ theme: "dark" }} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Sacred Theme:</strong>{' '}
            <code>{'<IconComponent styles={{ theme: "sacred" }} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Custom Styling:</strong>{' '}
            <code>
              {'<IconComponent styles={{ color: "#ff0000", size: 32 }} />'}
            </code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Disabled State:</strong>{' '}
            <code>{'<IconComponent styles={{ disabled: true }} />'}</code>
          </p>
          <p>
            <strong>Sacred Features:</strong> Golden colors, rotating
            hieroglyphs on hover, mystical glow effects, and sacred animation
            keyframes
          </p>
        </div>
      </div>
    </div>
  )
}

export const AllIconsShowcase: Story = {
  render: () => <IconShowcase />,
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of all 270 icons demonstrating Light, Dark, and Sacred theming capabilities using the centralized theme system.',
      },
    },
  },
}
