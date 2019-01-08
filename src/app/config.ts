
function makeAppConfig() {
  const date = new Date();
  const year = date.getFullYear();

  const AppConfig = {
    brand: 'Fidelity & Guaranty Life',
    user: 'Lisa',
    year,
    layoutBoxed: false,               // true, false
    navCollapsed: false,              // true, false
    navBehind: false,                 // true, false
    fixedHeader: true,                // true, false
    sidebarWidth: 'middle',           // small, middle, large
    theme: 'light',                   // light, gray, dark
    colorOption: '34',                // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
    AutoCloseMobileNav: true,         // true, false. Automatically close sidenav on route change (Mobile only)
    productLink: '#',                 // Only referenced in customizer.component.html. Not needed? Only reference to my-app-customizer selector is in layout.component.html and it is commented out.
    fglHoldingsLink:'https://fglife.bm',
    fglHomeLink:'https://home.fglife.com',
    // zendeskHelpCenterLink: 'https://fglifesupport.zendesk.com/hc/en-us/'  // Production
    zendeskHelpCenterLink: 'https://fglifesupport1511961278.zendesk.com/hc/en-us/'  // Sandbox
  };

  return AppConfig;
}

export const APPCONFIG = makeAppConfig();
