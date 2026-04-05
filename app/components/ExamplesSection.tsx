import styles from "./ExamplesSection.module.css";

const EXAMPLES = [
  {
    raw: "It started raining suddenly and everything got wet.",
    sanchari:
      "അനിർവചനീയമായ ഒരു നിമിഷം — ആകാശം തന്റെ ദുഃഖം മഴയായി ചൊരിഞ്ഞപ്പോൾ, ഭൂമി നനഞ്ഞൊലിച്ചു, ആ ഈർപ്പം മണ്ണിന്റെ ഗന്ധമായി ഉയർന്നു.",
  },
  {
    raw: "I had a cup of tea while watching the sunset.",
    sanchari:
      "ചായ — ആ ഊഷ്മള ദ്രാവകം — അസ്തമയ ചുവപ്പിൽ അലിഞ്ഞ് ഒരു ധ്യാനമായി മാറുന്ന നേരം, കാലം നിശ്ചലമാകുന്നതു പോലെ തോന്നി.",
  },
  {
    raw: "I got lost in the narrow lanes and couldn't find my way.",
    sanchari:
      "ആ ഇടുങ്ങിയ ഗലികളിൽ വഴിതെറ്റുക എന്നത് നഷ്ടമല്ല; അറിയപ്പെടാത്ത ഒരു ലോകത്തിലേക്കുള്ള ആകസ്മിക ക്ഷണമാണ്.",
  },
  {
    raw: "The traffic was terrible and I was stuck for an hour.",
    sanchari:
      "ആ വഴിത്തടസ്സം — ജീവിതത്തിന്റെ ഒരു ഉപമ — മനുഷ്യൻ തന്റെ ലക്ഷ്യങ്ങളിലേക്ക് ഒഴുകിത്തളരുന്ന, ക്ഷമ മാത്രം ശേഷിക്കുന്ന ഒരു ദാർശനിക നിമിഷം.",
  },
];

export default function ExamplesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Classic Examples</p>
          <h2 className={styles.heading}>The Evolution</h2>
          <p className={styles.subheading}>
            See how the ordinary becomes extraordinary through the Sancharam
            lens.
          </p>
        </div>

        <div className={styles.grid}>
          {EXAMPLES.map((ex, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.rawBlock}>
                <span className={styles.label}>Raw Thought</span>
                <p className={styles.rawText}>{ex.raw}</p>
              </div>
              <div className={styles.arrow}>
                <span className="material-symbols-outlined">arrow_downward</span>
              </div>
              <div className={styles.sanchariBlock}>
                <span className={styles.label}>Sanchari Style</span>
                <p className={styles.sanchariText}>{ex.sanchari}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
