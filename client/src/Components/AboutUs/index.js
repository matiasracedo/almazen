import React from "react";
import { Icon } from "rsuite";
import styles from "./index.module.scss";
const AboutUs = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profileGroup}>
        <div className={styles.profileContainer}>
          <p className={styles.profileTitle}>Manuel Bolla Agrelo</p>
          <img
            alt=''
            className={styles.profileImage}
            src="https://avatars0.githubusercontent.com/u/70901898?s=460&u=a89f8bf6f3748b70deece72b25314881d3818d09&v=4"
          />
          <div className={styles.socialContainer}>
            <a href="https://github.com/Manubolla" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="github" />
            </a>
            <a href="https://www.linkedin.com/in/manuel-bolla-agrelo/" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="linkedin" />
            </a>
            <a href="mailto:manubolla17@gmail.com">
              <Icon size="2x" icon="envelope" />
            </a>
          </div>
        </div>

        <div className={styles.profileContainer}>
          <p className={styles.profileTitle}>Macarena Montes de oca</p>
          <img
            alt=''
            className={styles.profileImage}
            src="https://avatars2.githubusercontent.com/u/70122640?s=460&u=b6ee1cc045afec1cd97d12d10725552b4734138f&v=4"
          />
          <div className={styles.socialContainer}>
            <a href="https://github.com/macamontesdeoca" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="github" />
            </a>
            <a href="https://www.linkedin.com/in/macarena-montes-de-oca/" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="linkedin" />
            </a>
            <a href="mailto:macamdeoca@gmail.com">
              <Icon size="2x" icon="envelope" />
            </a>
          </div>
        </div>

        <div className={styles.profileContainer}>
          <p className={styles.profileTitle}>Matias Racedo</p>
          <img
            alt=''
            className={styles.profileImage}
            src="https://avatars1.githubusercontent.com/u/71198410?s=460&u=ca2fe227426b8de3e95c3f681775a51637399e83&v=4"
          />
          <div className={styles.socialContainer}>
            <a href="https://github.com/matiasracedo" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="github" />
            </a>
            <a href="https://linkedin.com/in/matias-racedo" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="linkedin" />
            </a>
            <a href="mailto:matiasracedo@gmail.com">
              <Icon size="2x" icon="envelope" />
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.profileGroup} id='bottomContainer'>
        <div className={styles.profileContainer}>
          <p className={styles.profileTitle}>Ezequiel Pereyra</p>
          <img
            alt=''
            className={styles.profileImage}
            src="https://avatars1.githubusercontent.com/u/50385003?s=460&u=917b1dfd09b22acf19a75fecb801f1fb515958dd&v=4"
          />
          <div className={styles.socialContainer}>
            <a href="https://github.com/Ezequielpereyraa" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="github" />
            </a>
            <a href="https://www.linkedin.com/in/ezequielpereyra/" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="linkedin" />
            </a>
            <a href="mailto:gezequielpereyra@gmail.com">
              <Icon size="2x" icon="envelope" />
            </a>
          </div>
        </div>

        <div className={styles.profileContainer}>
          <p className={styles.profileTitle}>Nicolas Diaz</p>
          <img
            alt=''
            className={styles.profileImage}
            src="https://avatars2.githubusercontent.com/u/62527664?s=460&u=d2525b093920b9318e67d6df18f55c4a3a79ac82&v=4"
          />
          <div className={styles.socialContainer}>
            <a href="https://github.com/Nicoglx" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="github" />
            </a>
            <a href="https://www.linkedin.com/in/nicolas-m-diaz/" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="linkedin" />
            </a>
            <a href="mailto:nicolasmdiaz00@gmail.com">
              <Icon size="2x" icon="envelope" />
            </a>
          </div>
        </div>

        <div className={styles.profileContainer}>
          <p className={styles.profileTitle}>Javier Alvarez</p>
          <img
            alt=''
            className={styles.profileImage}
            src="https://avatars2.githubusercontent.com/u/51685167?s=460&u=155d2c3f4bc9cb0d77477b8657781b86c6024fc6&v=4"
          />
          <div className={styles.socialContainer}>
            <a href="https://github.com/j6alvarez" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="github" />
            </a>
            <a href="https://www.linkedin.com/in/javier6alvarez/" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="linkedin" />
            </a>
            <a href="mailto:javier96alvarez@gmail.com">
              <Icon size="2x" icon="envelope" />
            </a>
          </div>
        </div>

        <div className={styles.profileContainer}>
          <p className={styles.profileTitle}>Patricio Cadenas</p>
          <img
            alt=''
            className={styles.profileImage}
            src="https://avatars0.githubusercontent.com/u/64565858?s=460&u=a58b85eeee4cc45516c87e8f589046571e406814&v=4"
          />
          <div className={styles.socialContainer}>
            <a href="https://github.com/plcTools" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="github" />
            </a>
            <a href="https://www.linkedin.com/in/patricio-cadenas-18331131/" rel="noreferrer noopener" target="_blank">
              <Icon size="2x" icon="linkedin" />
            </a>
            <a href="mailto:patricioLcadenas@gmail.com">
              <Icon size="2x" icon="envelope" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
