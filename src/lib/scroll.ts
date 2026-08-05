export const scrollToSection = (href: string, navId = 'nav') => {
  if (href === '#pricing' || href === 'pricing') {
    const cta = document.getElementById('pricing-cta');
    const target = cta ?? document.querySelector('#pricing');
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const target = document.querySelector(href.startsWith('#') ? href : `#${href}`) as HTMLElement | null;
  if (!target) return;
  const navH = (document.getElementById(navId)?.offsetHeight ?? 0) + 12;
  const top = target.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top, behavior: 'smooth' });
};
