import React from 'react';
import styles from './Footer.module.css';
import { FooterProps } from '../../../../components/footer/Footer';
import Link from 'next/link';

const Footer: React.FC<FooterProps> = ({ footer }) => {
  const {
    backgroundColor,
    textColor,
    fontSize,
    position,
    siteLogoUrl,
    siteLogoAltText,
    siteLogoSize,
    socialSection,
    linksSection,
    contactSection,
    categorySection
  } = footer;

  return (
    <footer
      className={styles.footer}
      style={{
        backgroundColor: backgroundColor || '#111',
        color: textColor || '#fff',
        fontSize: fontSize || '14px',
        position: position === 'fixed' ? 'fixed' : undefined,
        width: '100%',
      }}
    >
      <div className={styles.footerContainer}>

        {categorySection && (
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>{categorySection.title}</h3>
            <ul className={styles.linksList}>
              {categorySection.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.url}>
                    <span className={styles.footerLink}>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {linksSection && (
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>{linksSection.title}</h3>
            <ul className={styles.linksList}>
              {linksSection.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.url}>
                    <span className={styles.footerLink}>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {contactSection && (
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>{contactSection.title}</h3>
            <ul className={styles.linksList}>
              {contactSection.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.url}>
                    <span className={styles.footerLink}>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {socialSection && (
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>{socialSection.title}</h3>
            <div className={styles.socialLinks}>
              {socialSection.links.map((link, index) => (
                <Link href={link.url} key={index}>
                  <span className={styles.socialLink}>
                    {link.icon ? (
                      <img
                        src={link.icon}
                        alt={link.name}
                        className={styles.socialIcon}
                      />
                    ) : (
                      link.name
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

                <div className={styles.footerSection}>
          {siteLogoUrl && (
            <div className={styles.logoContainer}>
              <img
                src={siteLogoUrl}
                alt={siteLogoAltText || 'Site Logo'}
                style={{
                  width: siteLogoSize?.width || '100px',
                  height: siteLogoSize?.height || '50px',
                }}
                className={styles.logo}
              />
              <p className={styles.copyright}>
                © {new Date().getFullYear()} Fitness Store. כל הזכויות שמורות.
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;