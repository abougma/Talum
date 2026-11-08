"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { advisorConfig } from "@/lib/advisor/config";
import { computeAdvice } from "@/lib/advisor/engine";
import {
  ADVISOR_CONSTRAINTS,
  BUDGETS,
  GOALS,
  PROJECT_TYPES,
  STAGES,
  type AdvisorConstraintId,
  type AdvisorResult,
  type Budget,
  type Goal,
  type ProjectType,
  type Stage,
} from "@/lib/advisor/types";

const TOTAL_STEPS = 5;
const STEP_KEYS = ["projectType", "goal", "stage", "constraints", "budget"] as const;

type Draft = {
  projectType: ProjectType | null;
  goal: Goal | null;
  stage: Stage | null;
  constraints: AdvisorConstraintId[];
  budget: Budget | null;
};

const initialDraft: Draft = {
  projectType: null,
  goal: null,
  stage: null,
  constraints: [],
  budget: null,
};

const projectTypeOptions = PROJECT_TYPES.map((value) => ({
  value,
  labelKey: `projectTypes.${value}`,
  hintKey: `projectTypeHints.${value}`,
}));

const goalOptions = GOALS.map((value) => ({
  value,
  labelKey: `goals.${value}`,
  hintKey: `goalHints.${value}`,
}));

const stageOptions = STAGES.map((value) => ({
  value,
  labelKey: `stages.${value}`,
  hintKey: `stageHints.${value}`,
}));

const constraintOptions = ADVISOR_CONSTRAINTS.map((value) => ({
  value,
  labelKey: `constraints.${value}`,
}));

const budgetOptions = BUDGETS.map((value) => ({
  value,
  labelKey: `budgets.${value}`,
  hintKey: `budgetHints.${value}`,
}));

function advisorMessageKey(key: string): string {
  return key.startsWith("Advisor.") ? key.slice("Advisor.".length) : key;
}

export function AdvisorWizard() {
  const t = useTranslations("AdvisorPage");
  const tAdvisor = useTranslations("Advisor");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (showResult) {
      resultHeadingRef.current?.focus();
    } else {
      stepHeadingRef.current?.focus();
    }
  }, [showResult, step]);

  function updateDraft(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
  }

  function toggleConstraint(value: AdvisorConstraintId) {
    setDraft((current) => ({
      ...current,
      constraints: current.constraints.includes(value)
        ? current.constraints.filter((item) => item !== value)
        : [...current.constraints, value],
    }));
    setError(null);
  }

  function isStepComplete(index: number): boolean {
    switch (index) {
      case 0:
        return draft.projectType !== null;
      case 1:
        return draft.goal !== null;
      case 2:
        return draft.stage !== null;
      case 3:
        return true;
      case 4:
        return draft.budget !== null;
      default:
        return false;
    }
  }

  function handleNext() {
    if (!isStepComplete(step)) {
      setError(t("required"));
      return;
    }

    if (step < TOTAL_STEPS - 1) {
      setStep((current) => current + 1);
      return;
    }

    if (!draft.projectType || !draft.goal || !draft.stage || !draft.budget) {
      setError(t("required"));
      return;
    }

    try {
      const nextResult = computeAdvice(advisorConfig, {
        projectType: draft.projectType,
        goal: draft.goal,
        stage: draft.stage,
        constraints: draft.constraints,
        budget: draft.budget,
      });
      setResult(nextResult);
      setShowResult(true);
      setError(null);
    } catch {
      setError(t("error"));
    }
  }

  function handleBack() {
    if (showResult) {
      setShowResult(false);
      setStep(TOTAL_STEPS - 1);
      return;
    }

    setStep((current) => Math.max(0, current - 1));
  }

  function handleEdit() {
    setShowResult(false);
    setResult(null);
    setStep(0);
  }

  function handleRestart() {
    setDraft(initialDraft);
    setResult(null);
    setShowResult(false);
    setStep(0);
    setError(null);
  }

  const stepKey = STEP_KEYS[step];
  const question = t(`questions.${stepKey}`);

  return (
    <div className="advisor-shell">
      <nav aria-label={t("progressLabel")} className="advisor-progress">
        <ol>
          {STEP_KEYS.map((key, index) => {
            const isCurrent = !showResult && index === step;
            const isDone = showResult || index < step;

            return (
              <li
                aria-current={isCurrent ? "step" : undefined}
                className={isCurrent ? "is-current" : isDone ? "is-done" : undefined}
                key={key}
              >
                <span className="advisor-progress-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{t(`steps.${key}`)}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {showResult && result ? (
        <section aria-labelledby="advisor-result-title" className="advisor-result">
          <header className="advisor-result-header">
            <p className="eyebrow">{t("resultEyebrow")}</p>
            <h2 id="advisor-result-title" ref={resultHeadingRef} tabIndex={-1}>
              {tAdvisor(`approaches.${result.approach}`)}
            </h2>
            <p className="lead">{t("resultIntro")}</p>
          </header>

          <div className="advisor-result-grid">
            <div className="advisor-result-main">
              <div>
                <h3>{t("reasonLabel")}</h3>
                <p>{tAdvisor(advisorMessageKey(result.reasonKey))}</p>
              </div>

              <div>
                <p className="eyebrow">{t("durationLabel")}</p>
                <p className="advisor-duration">
                  {t("duration", {
                    min: result.durationWeeks.min,
                    max: result.durationWeeks.max,
                  })}
                </p>
                <p className="section-note">{t("durationNote")}</p>
              </div>

              <div>
                <h3>{t("stackLabel")}</h3>
                <ul className="tag-list">
                  {result.stackKeys.map((key) => (
                    <li className="tag" key={key}>
                      {tAdvisor(advisorMessageKey(key))}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>{t("risksLabel")}</h3>
                <ul className="bullet-list">
                  {result.risks.map((riskId) => (
                    <li key={riskId}>{tAdvisor(`risks.${riskId}`)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="advisor-result-aside">
              <div>
                <p className="eyebrow">{t("nextStepLabel")}</p>
                <p>{tAdvisor(`nextSteps.${result.nextStepId}`)}</p>
                <Link className="button button-primary" href="/contact">
                  {t(`nextStepCta.${result.nextStepId}`)}
                </Link>
              </div>

              <div>
                <p className="eyebrow">{t("traceabilityLabel")}</p>
                <dl className="metric">
                  <dt>{t("ruleLabel")}</dt>
                  <dd className="advisor-trace">{result.matchedRuleId}</dd>
                  <dt>{t("configVersion")}</dt>
                  <dd className="advisor-trace">{result.configVersion}</dd>
                </dl>
                <p className="section-note">{t("noLlm")}</p>
              </div>

              <div>
                <h3>{t("disclaimersLabel")}</h3>
                <ul className="bullet-list advisor-small">
                  {result.disclaimers.map((key) => (
                    <li key={key}>{tAdvisor(advisorMessageKey(key))}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="advisor-result-footer">
            <div>
              <h3>{t("assumptionsLabel")}</h3>
              <ul className="bullet-list advisor-small">
                {result.assumptions.map((key) => (
                  <li key={key}>{tAdvisor(advisorMessageKey(key))}</li>
                ))}
              </ul>
            </div>
            <div className="advisor-actions">
              <button className="button button-secondary" onClick={handleEdit} type="button">
                {t("edit")}
              </button>
              <button className="advisor-restart" onClick={handleRestart} type="button">
                {t("restart")}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section aria-labelledby="advisor-step-title" className="advisor-step">
          <p className="eyebrow">{t("step", { current: step + 1, total: TOTAL_STEPS })}</p>
          <h2
            className="advisor-question"
            id="advisor-step-title"
            ref={stepHeadingRef}
            tabIndex={-1}
          >
            {question}
          </h2>

          {step === 3 ? <p className="section-intro">{t("questions.constraintsHelp")}</p> : null}

          <div
            aria-labelledby="advisor-step-title"
            className="advisor-options"
            role={step === 3 ? "group" : "radiogroup"}
          >
            {step === 0
              ? projectTypeOptions.map((option) => (
                  <label
                    className={
                      draft.projectType === option.value
                        ? "advisor-option is-selected"
                        : "advisor-option"
                    }
                    key={option.value}
                  >
                    <input
                      checked={draft.projectType === option.value}
                      name="projectType"
                      onChange={() => updateDraft({ projectType: option.value })}
                      type="radio"
                      value={option.value}
                    />
                    <span className="advisor-option-body">
                      <span className="advisor-option-title">{t(option.labelKey)}</span>
                      <span className="advisor-option-hint">{t(option.hintKey)}</span>
                    </span>
                  </label>
                ))
              : null}

            {step === 1
              ? goalOptions.map((option) => (
                  <label
                    className={
                      draft.goal === option.value ? "advisor-option is-selected" : "advisor-option"
                    }
                    key={option.value}
                  >
                    <input
                      checked={draft.goal === option.value}
                      name="goal"
                      onChange={() => updateDraft({ goal: option.value })}
                      type="radio"
                      value={option.value}
                    />
                    <span className="advisor-option-body">
                      <span className="advisor-option-title">{t(option.labelKey)}</span>
                      <span className="advisor-option-hint">{t(option.hintKey)}</span>
                    </span>
                  </label>
                ))
              : null}

            {step === 2
              ? stageOptions.map((option) => (
                  <label
                    className={
                      draft.stage === option.value ? "advisor-option is-selected" : "advisor-option"
                    }
                    key={option.value}
                  >
                    <input
                      checked={draft.stage === option.value}
                      name="stage"
                      onChange={() => updateDraft({ stage: option.value })}
                      type="radio"
                      value={option.value}
                    />
                    <span className="advisor-option-body">
                      <span className="advisor-option-title">{t(option.labelKey)}</span>
                      <span className="advisor-option-hint">{t(option.hintKey)}</span>
                    </span>
                  </label>
                ))
              : null}

            {step === 3
              ? constraintOptions.map((option) => (
                  <label
                    className={
                      draft.constraints.includes(option.value)
                        ? "advisor-option is-selected"
                        : "advisor-option"
                    }
                    key={option.value}
                  >
                    <input
                      checked={draft.constraints.includes(option.value)}
                      name="constraints"
                      onChange={() => toggleConstraint(option.value)}
                      type="checkbox"
                      value={option.value}
                    />
                    <span className="advisor-option-body">
                      <span className="advisor-option-title">{t(option.labelKey)}</span>
                    </span>
                  </label>
                ))
              : null}

            {step === 4
              ? budgetOptions.map((option) => (
                  <label
                    className={
                      draft.budget === option.value
                        ? "advisor-option is-selected"
                        : "advisor-option"
                    }
                    key={option.value}
                  >
                    <input
                      checked={draft.budget === option.value}
                      name="budget"
                      onChange={() => updateDraft({ budget: option.value })}
                      type="radio"
                      value={option.value}
                    />
                    <span className="advisor-option-body">
                      <span className="advisor-option-title">{t(option.labelKey)}</span>
                      <span className="advisor-option-hint">{t(option.hintKey)}</span>
                    </span>
                  </label>
                ))
              : null}
          </div>

          {error ? (
            <p className="field-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="advisor-actions">
            {step > 0 ? (
              <button className="button button-secondary" onClick={handleBack} type="button">
                {t("back")}
              </button>
            ) : null}
            <button className="button button-primary" onClick={handleNext} type="button">
              {step === TOTAL_STEPS - 1 ? t("submit") : t("next")}
            </button>
          </div>

          <p aria-live="polite" className="visually-hidden">
            {t("stepAnnouncement", { current: step + 1, total: TOTAL_STEPS, title: question })}
          </p>
        </section>
      )}
    </div>
  );
}
