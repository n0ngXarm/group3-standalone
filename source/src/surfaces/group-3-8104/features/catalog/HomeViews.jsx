import { useState } from "react";

import Icon from "../../../../shared/components/ui/Icon.jsx";
import { checkIcon, fileInvoiceIcon } from "../../../../shared/components/ui/iconPaths.js";
import { REPORT_CONFIG } from "../../../../shared/lib/config.js";
import { COPY as SHARED_COPY } from "../../../../shared/lib/copy.js";
import { COPY } from "../../content/copy.js";

export function AboutView({ language, onBack }) {
  const text = COPY[language];
  return (
    <main className="g3-home-view">
      <section className="g3-home-view-panel g3-about-view-panel" aria-labelledby="g3-about-view-title">
        <p className="g3-kicker">ABOUT · 关于我们</p>
        <h1 id="g3-about-view-title" tabIndex="-1">{text.footerTitle}</h1>
        <p className="g3-home-view-desc">{text.footerGroupInfo}</p>
        <div className="g3-about-view-block">
          <h2>{text.footerMembersTitle}</h2>
          <ul className="g3-about-view-members">
            <li>{text.footerMember1}</li>
            <li>{text.footerMember2}</li>
            <li>{text.footerMember3}</li>
          </ul>
        </div>
        <small className="g3-about-view-course">{text.footerCourse}</small>
        <div className="g3-home-view-actions">
          <button className="g3-primary-action" type="button" onClick={onBack}>{text.back}<i aria-hidden="true">→</i></button>
        </div>
      </section>
    </main>
  );
}

export function ReportView({ language, onBack }) {
  const report = SHARED_COPY[language].report;
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const categories = [
    ["bug", report.categoryBug],
    ["content", report.categoryContent],
    ["design", report.categoryDesign],
    ["suggestion", report.categorySuggestion],
  ];
  const severities = [
    ["low", report.severityLow],
    ["medium", report.severityMedium],
    ["high", report.severityHigh],
  ];

  const validate = () => {
    const nextErrors = {};
    if (!category) nextErrors.category = true;
    if (!severity) nextErrors.severity = true;
    if (!description || description.length < REPORT_CONFIG.descriptionMinChars) {
      nextErrors.description = report.descriptionTooShort;
    } else if (description.length > REPORT_CONFIG.descriptionMaxChars) {
      nextErrors.description = report.descriptionTooLong;
    }
    if (steps.length > REPORT_CONFIG.stepsMaxChars) nextErrors.steps = report.stepsTooLong;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    if (validate()) setSubmitted(true);
  };

  return (
    <main className="g3-home-view">
      <section className="g3-home-view-panel g3-report-view-panel" aria-labelledby="g3-report-view-title">
        <p className="g3-kicker"><Icon paths={fileInvoiceIcon} />{report.kicker}</p>
        <h1 id="g3-report-view-title" tabIndex="-1">{report.title}</h1>
        <p className="g3-home-view-desc">{report.subtitle}</p>
        {!submitted ? (
          <>
            <div className="g3-report-form">
              <div className="g3-report-field">
                <span className="g3-report-label">{report.categoryLabel} <b aria-hidden="true">*</b></span>
                <div className="g3-report-chips" role="radiogroup" aria-label={report.categoryLabel}>
                  {categories.map(([value, label]) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={category === value}
                      className={category === value ? "is-active" : ""}
                      key={value}
                      onClick={() => setCategory(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {errors.category && <small className="g3-report-error">{report.invalidPayload}</small>}
              </div>
              <div className="g3-report-field">
                <span className="g3-report-label">{report.severityLabel} <b aria-hidden="true">*</b></span>
                <div className="g3-report-chips" role="radiogroup" aria-label={report.severityLabel}>
                  {severities.map(([value, label]) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={severity === value}
                      className={severity === value ? "is-active" : ""}
                      key={value}
                      onClick={() => setSeverity(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {errors.severity && <small className="g3-report-error">{report.invalidPayload}</small>}
              </div>
              <div className="g3-report-field">
                <label className="g3-report-label" htmlFor="g3-report-description">{report.descriptionLabel} <b aria-hidden="true">*</b></label>
                <textarea
                  id="g3-report-description"
                  value={description}
                  placeholder={report.descriptionPlaceholder}
                  maxLength={REPORT_CONFIG.descriptionMaxChars}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <small className="g3-report-hint">{report.descriptionHint} · <span>{description.length} / {REPORT_CONFIG.descriptionMaxChars} {report.characterCount}</span></small>
                {errors.description && <small className="g3-report-error">{errors.description}</small>}
              </div>
              <div className="g3-report-field">
                <label className="g3-report-label" htmlFor="g3-report-steps">{report.stepsLabel}</label>
                <textarea
                  id="g3-report-steps"
                  value={steps}
                  placeholder={report.stepsPlaceholder}
                  maxLength={REPORT_CONFIG.stepsMaxChars}
                  onChange={(event) => setSteps(event.target.value)}
                />
                <small className="g3-report-hint">{report.stepsHint} · <span>{steps.length} / {REPORT_CONFIG.stepsMaxChars} {report.characterCount}</span></small>
                {errors.steps && <small className="g3-report-error">{errors.steps}</small>}
              </div>
            </div>
            <div className="g3-home-view-actions">
              <button className="g3-primary-action" type="button" onClick={submit}>{report.submit}<i aria-hidden="true">→</i></button>
              <button className="g3-text-action" type="button" onClick={onBack}>{report.cancel}</button>
            </div>
          </>
        ) : (
          <div className="g3-report-success" role="status">
            <Icon paths={checkIcon} />
            <h2>{report.successTitle}</h2>
            <p>{report.successBody}</p>
            <div className="g3-home-view-actions">
              <button className="g3-primary-action" type="button" onClick={() => { setCategory(""); setSeverity(""); setDescription(""); setSteps(""); setErrors({}); setSubmitted(false); }}>{report.submitAnother}<i aria-hidden="true">→</i></button>
              <button className="g3-text-action" type="button" onClick={onBack}>{report.cancel}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
