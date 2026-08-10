# Project brief

## Product

TRACE AI is an incident-command workspace that structures scattered engineering evidence. Its primary users are experienced developers, SREs, support engineers, incident commanders, and service owners.

## Problem

Incident responders often spend early minutes reconciling unrelated logs, alerts, release notes, and support observations. Generic chat interfaces obscure evidence provenance and encourage conversational certainty. TRACE AI instead provides a fixed investigation model: observations, service state, event order, hypotheses, contradictions, verification, action priority, healthy signals, gaps, and limitations.

## Success criteria

- A responder can load a realistic sample and reach a useful investigation in one flow.
- An inference is never presented as a confirmed root cause without direct evidence.
- No API key enters client code or source control.
- The application remains usable on mobile, with reduced motion, and without WebGL.
- Missing-key, upstream-error, corrupted-storage, offline, privacy-warning, and unknown-route states remain actionable.
- The latest valid investigation survives refresh.

## Non-goals

Authentication, team collaboration, database persistence, alert-provider ingestion, autonomous remediation, and executed-action tracking are deliberately outside this capstone’s scope.
