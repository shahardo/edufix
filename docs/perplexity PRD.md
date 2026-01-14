# Product Requirements Document (PRD)
## Adaptive Classroom Learning & Gap-Reduction Platform

**Version:** 1.0  
**Date:** January 2026  
**Status:** Active Development

---

## 1. Product Overview

### 1.1 Vision
Build an intelligent, classroom-ready learning platform that reduces learning gaps by providing adaptive, multi-modal, and collaborative learning experiences for high school students. The system supports both STEM and humanities subjects with full multilingual support (Hebrew + English as primary; extensible to additional languages). Additionally, the platform includes an AI-powered **Content Improvement Module** that analyzes teacher materials and suggests or auto-generates improvements to presentations, lesson plans, homework assignments, and other pedagogical resources.

### 1.2 Target Users
- **Primary (Phase 1):** High school students (grades 9–12 / ages 15–18).  
- **Secondary (Phase 1):** High school teachers (math, sciences, humanities, languages, history).  
- **Extensible (Phase 2+):** Middle school, primary school (with age-appropriate theme/UI variants).  
- **Future (Phase 3):** School administrators and curriculum leaders.

### 1.2.1 Age-Based Theming & Differentiation
While Phase 1 targets high school, the system architecture must support:
- **Theme variants:** UI, colors, fonts, and interaction patterns can be customized per age cohort.  
- **Content difficulty scaling:** Exercises, hints, and explanations adapt not just to individual mastery but to age-appropriateness.  
- **Language support:** Terminology and explanations remain age-appropriate across languages.  
- **Future extensibility:** Phase 2+ can onboard middle school and elementary with minimal backend changes.

### 1.3 Core Goals
1. **Reduce learning gaps** within a class by detecting individual and group weaknesses early and providing targeted support.  
2. **Enhance student engagement** through interactive, multi-sensory, and game-like learning.  
3. **Empower teachers** with clear analytics on strengths, weaknesses, and progression at individual and class levels.  
4. **Support strong students** with enrichment content and peer-teaching opportunities.  
5. **Improve teaching materials** using AI to analyze and enhance presentations, lesson plans, homework, and other teacher resources.  
6. **Support multiple languages** (UI + content) and extensibility to additional languages and age groups.

---

## 2. Scope and Out of Scope

### 2.1 In Scope (Phase 1)

**Core Features:**
- Student web application (responsive: desktop, tablet, mobile-friendly).  
- Teacher web application (desktop-optimized, responsive).  
- Class and course management.  
- Content upload and organization per lesson.  
- Student Q&A engine with NLP-driven explanations.  
- Adaptive practice (questions, tiered hints, feedback).  
- Teacher dashboard with per-student and per-topic analytics.  
- Multi-lingual UI (Hebrew & English) and content handling.  
- Collaborative group learning flows with system monitoring.  
- Gamification layer (points, badges, streaks).  
- Homework assignments, submission, and analysis.  
- **NEW: Content Improvement Module** – AI analysis and auto-suggestions for teacher materials.

**Subject Coverage (Phase 1 – Full Breadth, Partial Depth):**
- **Fully developed:** Mathematics, History.  
- **Scaffolded/Template-based:** Physics, Chemistry, Biology, English Language, Hebrew Language, Literature.  
  - These subjects are available but use shared templates; deep customization (e.g., physics simulators, biology diagrams) deferred to Phase 2.

**Deployment & Access:**
- Standalone web platform (no SIS integration required for Phase 1).  
- Local user authentication (username/password).  
- CSV import of class rosters.  
- Multi-lingual support (UI localization + content language handling).

---

### 2.2 Out of Scope (Phase 1)

- Native mobile apps (iOS/Android) – web app is mobile-responsive.  
- Integration with external SIS (Google Classroom, Microsoft Teams, Moodle) – deferred to Phase 2.  
- Advanced offline mode (graceful handling of brief disconnections only).  
- Video generation/deep synthesis for AI-created lessons (use text + images initially).  
- Real-time face-to-face classroom screen-share features.  
- School-level role (admin panel for managing multiple teachers/classes) – deferred to Phase 2.

---

## 3. Multi-Lingual & Multi-Audience Requirements

### 3.1 Language Support

**Phase 1 Target Languages:**
- **Hebrew (עברית):** Primary language for Israeli schools (RTL layout).  
- **English:** Secondary, for schools using English-language materials and international curricula.

**Localization Approach:**
- All UI strings externalized to translation files (JSON/YAML).  
- Automatic RTL/LTR layout switching based on selected language.  
- Fonts must support Hebrew, Latin, and special characters (e.g., mathematical symbols).  
- Teacher can author content in any language; system displays it as-is while UI language remains independent.

**Language Handling in Student Interaction:**
- Students select UI language (persists in session/profile).  
- Students may ask questions in their preferred language (Hebrew or English).  
- System returns answers in the **student's UI language** while preserving subject-specific terminology in the original language.  
- Example: A student using Hebrew UI asks a question about "photosynthesis" (English science class); system returns explanation in Hebrew but retains "photosynthesis" as the term.

**Future Extensibility (Phase 2+):**
- Add Arabic, Russian, French, or other languages by inserting new translation files.  
- Support for content translation overlays (hover-to-translate).

### 3.2 Age-Based Theming

**Phase 1 (High School Focus):**
- Default theme: professional, clean, typography-focused.  
- Suitable for ages 15–18; minimal cartoonish elements.  
- Serious tone matching academic context.

**Phase 2+ (Extensibility Requirements):**
- **Middle school variant:** Slightly more colorful, icons + text, encourage collaboration.  
- **Elementary variant:** Gamification-heavy, visual, playful colors, simpler language.  
- System admin can select theme per class or per student.  
- Themes adjust font sizes, icon complexity, color palettes, and help text length.

---

## 4. Core Use Cases

### 4.1 Student Learning Flow

1. **Student logs in** and views "Today's Lesson" and pending assignments.  
2. **During lesson:** Student views lesson content (slides, notes) and can ask contextual questions.  
3. **System responds** with explanations, examples, or references to prior content.  
4. **Student practices** with system-generated or teacher-assigned exercises.  
5. **If stuck:** Student requests hints (Level 1 → 2 → 3 → full solution).  
6. **System infers mastery** from accuracy, speed, and hint usage.  
7. **Student sees progress** (badges, points, mastery meter per topic).  
8. **Strong students** receive enrichment tasks and peer-teaching invitations.

### 4.2 Teacher Content Creation & Analysis Flow

1. **Teacher uploads materials** (slides, PDFs, lesson plans, homework).  
2. **Content Improvement Module analyzes** the materials automatically.  
3. **System generates suggestions:**  
   - Clarity improvements (e.g., "This sentence is too long; break it into two.")  
   - Content gaps (e.g., "Missing example for [concept]; add one to boost clarity.")  
   - Pedagogical improvements (e.g., "Add a warm-up question before defining X.")  
   - Auto-corrected version (inline edits or side-by-side comparison).  
4. **Teacher reviews suggestions** and accepts, rejects, or customizes improvements.  
5. **Improved material** is published to students.

### 4.3 Teacher Dashboard & Analytics Flow

1. **Teacher logs in** and views daily class snapshot (mastery, homework completion, risks).  
2. **Drill into a topic** to see which students are struggling.  
3. **View individual student profile** with error patterns, strengths, and recommendations.  
4. **Assign targeted practice** or enrich strong students.  
5. **Review group learning sessions** for collaboration quality.  
6. **Export analytics** for further analysis or parent reports.

### 4.4 Collaborative Group Learning Flow

1. **Teacher assigns a topic** to a small group (2–4 students).  
2. **Students enter shared workspace** with central question/task and shared scratchpad.  
3. **One student explains** while others listen/ask questions.  
4. **System monitors** conversation, detects misconceptions, offers prompts.  
5. **Upon completion,** system records individual and group performance.  
6. **Peer contributions** are credited (points for explaining clearly, asking good questions).

---

## 5. User Experience & Screen Descriptions

### 5.1 Student Experience

#### 5.1.1 Student Home Screen
**Purpose:** Entry point; see today's lessons, tasks, progress, and recent achievements.

**Key Sections:**
- **Top Navigation:**  
  - App logo (left).  
  - Class name and subject (if multiple classes, dropdown).  
  - Language toggle (עברית | English).  
  - Profile menu (settings, log out).

- **Main Content Area:**
  - **"Today's Lesson" Card:** Subject, topic, time, instructor name, "Go to lesson" button.  
  - **"My Tasks" Widget:** Pending homework, practice sets, due dates, completion %.  
  - **"My Progress" Snapshot:** Overall mastery bar, last 3 topics, current streak.  
  - **"Achievements" Widget:** Recent badges, total points, rank (if leaderboard enabled).  
  - **"Upcoming Events":** Quizzes, assignments, group sessions.

**Interactions:**
- Tap to open lesson.  
- Tap homework to start it.  
- Tap practice topic for recommended exercises.  
- Tap language toggle to switch UI.  
- Tap profile for settings (e.g., theme, notifications).

---

#### 5.1.2 Lesson Workspace Screen
**Purpose:** Main environment during class/self-study for a specific lesson.

**Layout:**
- **Left Panel (Desktop) / Collapsible (Mobile):** Lesson content.  
  - Slide viewer / PDF reader / embedded video.  
  - Tabs: "Slides", "Notes", "Glossary".  
- **Right Panel / Slide-Over (Mobile):** Interactive tools.  
  - Q&A chat box with system.  
  - "Ask about this slide" quick button.  
  - Concept glossary (definitions relevant to current topic).  
  - "Start practice" button for the current topic.  
  - Progress bar (# slides viewed).

**Student Actions:**
- Navigate slides (forward/back, jump to slide number).  
- Type free-text question: "What does [term] mean?"  
- Ask with slide context (one-click).  
- Receive instant explanation or reference to prior slides.  
- Initiate practice session mid-lesson.  
- Add personal notes (private).

**Display Rules (Multi-Lingual):**
- UI: Hebrew or English based on student selection.  
- Slide content: as-is (original language).  
- Glossary: term in original language, definition in UI language.

---

#### 5.1.3 Practice & Hint Screen
**Purpose:** Adaptive exercise experience with tiered support.

**Key Components:**
- **Header:**  
  - Topic name, difficulty level (Easy/Medium/Hard), progress indicator (e.g., "Q3/10").  
  - Estimated time remaining.

- **Question Panel:**  
  - Question text (adapt to question type).  
  - Support for: multiple-choice, short text, numeric input, formula entry, open-ended.  
  - Inline formula rendering (MathJax).  
  - For humanities: longer text with formatting.

- **Interaction Bar:**  
  - "Check Answer" button.  
  - "Need a Hint?" button → Level 1 hint (general).  
  - "More Help" → Level 2 (specific).  
  - "Show Step-by-Step" → Level 3 (detailed walkthrough).  
  - "Show Solution" (if policy allows; after hint threshold).  
  - "Skip" (if teacher enabled; count as wrong for mastery).

- **Feedback Area:**  
  - After submit: "✓ Correct!" or "✗ Try again."  
  - Brief explanation of right answer.  
  - Link to "Similar Example" from past lessons.  
  - Option to "Review this topic" (link to related lesson content).

- **Progress & Rewards:**  
  - Points earned for correct answer, hints used affect points.  
  - Visual indicator if answer unlocks a badge (e.g., "10 in a row").

**Behavior:**
- Question difficulty and next questions adapt based on student accuracy.  
- System logs: answer, time, hints used, error type.  
- For STEM (math, physics): render formulas, show working step-by-step, support graph entry.  
- For humanities (history, language): support text analysis, grammar suggestions, citation guidance.

---

#### 5.1.4 Homework Overview & Submission Screen
**Purpose:** See assigned homework, work on it, submit, and receive feedback.

**Sections:**
- **Homework List:**  
  - Title, subject, due date, estimated time, status (not started/in progress/submitted/graded).  
  - Progress bar (% of questions completed).

- **Homework Detail View:**  
  - Brief description and learning goals.  
  - Instructions and any attachments.  
  - Question list with navigation (Previous/Next).  
  - Timer (if set by teacher) showing time remaining.  
  - "Save Draft" and "Submit" buttons.  
  - Submission status: "Auto-saves every 30 seconds."

- **Post-Submission View:**  
  - Summary of results: # correct, mastery %, error breakdown.  
  - System analysis: "You struggled with [topic]; want to review?"  
  - Teacher feedback (if provided).  
  - Option to "Retry" if teacher allows retakes.

---

#### 5.1.5 Group Learning Session Screen
**Purpose:** Facilitate collaborative learning with system-assisted monitoring.

**Components:**
- **Group Header:** Group name, members, topic, duration timer.  
- **Shared Content Area:**  
  - Central question or task.  
  - Shared whiteboard / scratchpad (basic drawing + text).  
  - Previous group notes (if this is a repeat group).

- **Explanation Mode (Rotating):**  
  - Current explainer highlighted with badge.  
  - Text input: explainer types/submits explanation.  
  - Other students see explanation and can:  
    - Post a question ("Doesn't understand step 3").  
    - Upvote clarity ("Good explanation!").  
    - Take notes (private).

- **System Assistant Pane:**  
  - Real-time sentiment/clarity check (if explanation seems unclear).  
  - Suggestive prompt: "Try to explain using an example from real life."  
  - Misconception detection: "Careful: [term] was used incorrectly. X is actually…"  
  - Encouragement badges for good questions, clear explanations.

- **After Session:**  
  - Summary: each participant's contribution, clarity score, points earned.  
  - Option to reflect: "What did you learn from your peers?"

---

### 5.2 Teacher Experience

#### 5.2.1 Teacher Dashboard – Class Overview
**Purpose:** Daily snapshot of class health and action items.

**Key Sections:**
- **Header:**  
  - Class name, subject, date.  
  - Filter by class (dropdown if teaching multiple).  
  - Refresh button, export button.

- **At-a-Glance Metrics:**  
  - % students completed latest homework.  
  - Top 3 struggling topics (with drill-down link).  
  - Class-wide mastery distribution (histogram or bar chart).  
  - Red flags: "3 students at risk" (clicking shows who).

- **Student List Table:**  
  - Sortable columns: Name, Recent Activity, Mastery Level, Risk Flag, Homework Status.  
  - Color coding: Green (good), yellow (caution), red (struggling).  
  - Action buttons: "View Profile", "Assign Practice", "Message", "Add to Group".

- **Class Insights:**  
  - Topic of the day with % mastery.  
  - Recommended action: "Reteach [topic]" or "Enrich strong students in [topic]".

**Navigation:**
- Link to detailed student profiles.  
- Link to content management (upload/edit/improve materials).  
- Link to analytics and reporting.  
- Link to group learning sessions.

---

#### 5.2.2 Teacher – Content Management & Improvement Screen
**Purpose:** Upload, organize, view, and improve teaching materials with AI assistance.

**Workflow:**

1. **Upload Section:**  
   - Drag-and-drop or file picker for slides (PowerPoint, Google Slides), PDFs, lesson plans, homework files.  
   - Auto-detect file type and metadata.  
   - Option to assign to course/unit/lesson.  
   - Tag by subject, topic, difficulty, language.

2. **Content List & Browser:**  
   - Tree view: Courses → Units → Lessons.  
   - Each lesson shows attached materials (slides, PDFs, homework, etc.).  
   - Preview button (opens in modal or new tab).  
   - Edit/Delete buttons.

3. **Content Improvement Module (NEW):**  
   - **Analyze Button:** Teacher clicks "Analyze & Improve" for selected material.  
   - **Processing:** System scans the material (slides, PDFs, text).  
   - **Suggestions Panel (Side-by-Side):**  
     - Original material on left, improvements on right.  
     - Color-coded suggestions:  
       - **Green:** Clarity/grammar fixes.  
       - **Blue:** Pedagogical enhancements (e.g., "add example").  
       - **Orange:** Content gaps or missing explanations.  
       - **Purple:** Alternative phrasings or better diagrams.  
     - Each suggestion includes:  
       - Original text.  
       - Proposed improvement.  
       - Rationale (e.g., "Improves clarity for ESL students").  
       - Accept / Reject / Custom Edit buttons.

   - **Example Suggestions:**  
     - **Clarity:** "This sentence is 45 words. Break into 2–3 sentences for clarity."  
     - **Pedagogy:** "No warm-up question before defining [concept]. Add a hook."  
     - **Content:** "Definition is present but no concrete example. Add one."  
     - **Visual:** "Text-heavy slide. Consider adding a diagram here."  
     - **Accessibility:** "Font size too small for visually impaired students. Increase to 18pt."

4. **Apply & Publish:**  
   - Teacher reviews all suggestions.  
   - Apply selected improvements (system generates cleaned-up version).  
   - Option for side-by-side comparison.  
   - Publish to class or save as draft.  
   - Version control: keep old version accessible.

5. **Analytics Integration:**  
   - After students use the material, show which improvements correlated with better understanding.  
   - e.g., "Students who saw the improved version understood [concept] 15% better."

---

#### 5.2.3 Teacher – Student Profile Screen
**Purpose:** Deep dive into one student's learning journey.

**Sections:**
- **Header:** Student name, class, language preference, contact info (if available).  
- **Mastery Heatmap:** Topics vs. mastery level (green to red gradient).  
- **Skill Breakdown:**  
  - Topics at mastery (80%+).  
  - Topics in progress (50–79%).  
  - Topics needing support (<50%).

- **Error Patterns Summary:**  
  - "Frequently struggles with multi-step word problems."  
  - "Grammar: past tense confusion (appears in 5 homework submissions)."  
  - "Strength: conceptual questions in history; weakness: application/analysis."

- **Timeline / Recent Activity:**  
  - Last 5 interactions (practice, homework, group session).  
  - Trend line (improving/stable/declining).

- **Teacher Action Buttons:**  
  - "Assign Targeted Practice" (pre-filled with weak topics).  
  - "Send Message" (to student).  
  - "Invite to Group Session."  
  - "Add Private Note" (for parent conference, IEP, etc.).  
  - "View Homework History" (drill into submitted work).

---

#### 5.2.4 Teacher – Assignment & Practice Creation Screen
**Purpose:** Create and assign homework or practice sessions.

**Workflow:**

1. **Basic Setup:**  
   - Name assignment.  
   - Select class(es).  
   - Choose subject.  
   - Pick topics and difficulty level.

2. **Question Source Selection:**  
   - **System-Generated:** Auto-create questions at specified difficulty.  
   - **Teacher-Created:** Upload or type your own questions.  
   - **Mixed:** Combine both.

3. **Hint & Solution Policy:**  
   - Decide whether to show hints: Always / After N attempts / Never.  
   - Decide whether to show solution: After submission / After due date / Never.  
   - Allow "Skip" button? (counts as wrong for mastery).

4. **Scheduling:**  
   - Assign date (immediately or schedule for future).  
   - Due date and due time.  
   - Attempt limits (unlimited / single attempt / N attempts).

5. **Review & Assign:**  
   - Preview assignment as a student would see it.  
   - Assign to students (auto-notification).  
   - Send to class or specific student groups.

6. **Post-Assignment:**  
   - Monitor completion in real-time (dashboard shows % submitted).  
   - Receive alerts for low performers or missing submissions.  
   - Review results and send follow-up assignments.

---

#### 5.2.5 Teacher – Analytics & Reports Screen
**Purpose:** Comprehensive analysis for reflection and planning.

**Views:**

- **Topic-Level Performance:**  
  - Bar chart: mastery % per topic across class.  
  - Table with # students at each mastery band.  
  - Click to see which students are struggling in [topic].

- **Homework Performance:**  
  - Score distribution (histogram).  
  - Completion rate %.  
  - Average hints used per question.  
  - Time spent per question.  
  - Link to review individual submissions.

- **Group Learning Insights:**  
  - How groups performed on collaborative tasks.  
  - Participation equity (did all members contribute equally?).  
  - Clarity scores for peer explanations.  
  - Recommendations for group composition next time.

- **Trend Analysis:**  
  - Class-wide mastery trend (improving/stable/declining).  
  - Individual student progress curves.  
  - Identify at-risk students early.

- **Export Options:**  
  - CSV export for further analysis in Excel.  
  - PDF report for parent meetings.  
  - JSON export for integration with other systems (future).

---

### 5.3 Content Improvement Module (NEW)

#### 5.3.1 Purpose & Scope
Analyze teacher-authored materials (presentations, PDFs, lesson plans, homework) and suggest improvements for:
- **Clarity:** Sentence length, jargon, ambiguity.  
- **Pedagogy:** Missing examples, warm-ups, check-for-understanding questions.  
- **Content:** Gaps, inaccuracies, missing context.  
- **Accessibility:** Font size, contrast, readability for diverse learners.  
- **Age-Appropriateness:** Language complexity matching target age.

#### 5.3.2 How It Works (High Level)
1. **Teacher uploads material** (PDF, PPTX, DOCX, plain text).  
2. **System extracts text and structure** (AI parses slides, sections, etc.).  
3. **Analysis pipeline:**  
   - Readability check (Flesch-Kincaid, etc.).  
   - Pedagogical heuristics (presence of examples, questions, summary).  
   - Domain-specific checks (accuracy for STEM, citation format for history).  
   - Accessibility checks (font sizes, contrast ratios).  
   - Language model check (AI suggests clearer phrasings).
4. **Generate suggestions** with severity levels (Critical, High, Medium, Low).  
5. **Present side-by-side** with original vs. improved.  
6. **Teacher accepts/rejects/customizes** improvements.  
7. **Publish improved version** and track student outcomes.

#### 5.3.3 Suggestion Categories
- **Clarity Improvements:**  
  - "Sentence too long; break into 2–3 shorter sentences."  
  - "Jargon alert: define [term] before use."  
  - "Ambiguous pronoun reference; use [specific noun]."

- **Pedagogical Enhancements:**  
  - "No warm-up question. Add a question to activate prior knowledge before defining [concept]."  
  - "Missing concrete example. Add a real-world scenario."  
  - "No summary slide. Add one to reinforce key points."  
  - "No formative check-for-understanding. Insert a quick question here."

- **Content Gaps:**  
  - "Definition of [concept] present but no real-world application. Add example."  
  - "Possible inaccuracy: [claim] should be verified against [source]."  
  - "Missing prerequisite: students may not know [prior concept]; add brief explanation."

- **Accessibility:**  
  - "Font size 12pt is too small; recommend 18pt for accessibility."  
  - "Color contrast ratio 3:1 (low); recommend 4.5:1 or higher."  
  - "No alt-text on images; add description for screen readers."

- **Structure & Organization:**  
  - "Slide 5 has 8 bullet points; consider breaking into 2 slides."  
  - "No clear learning objectives; add them to the beginning."  
  - "Slides 3–5 cover the same topic; consolidate for clarity."

---

## 6. Functional Requirements (Detailed)

### 6.1 Authentication & User Management
- **Registration:** Teachers self-register; students registered by teacher (via CSV or invite).  
- **Login:** Username/password (future: SAML, OAuth for school directory integration).  
- **Password reset:** Standard email-based reset flow.  
- **Roles:** Student, Teacher, (Admin in Phase 2).  
- **Session management:** Timeout after inactivity, "Remember me" option.

### 6.2 Content Management System
- **Hierarchy:** Course → Unit → Lesson → Materials.  
- **Materials:** Slides (PPTX/PDF), videos (link), documents (PDF/DOCX), text (markdown), homework templates.  
- **Metadata:** Topic, difficulty (1–5), subject, language, learning objectives, prerequisites.  
- **Full-text search:** Find materials by keyword.  
- **Versioning:** Keep history of material changes (optional teacher feature).

### 6.3 Student Q&A Engine
- **Natural-language input:** Student types a question in Hebrew or English.  
- **Intent classification:** Is this question about [lesson topic], prior lesson, or new topic?  
- **Response generation:**  
  - **If in lesson materials:** Return relevant slide/section + brief explanation.  
  - **If not covered:** Use AI (e.g., GPT-based) to generate age-appropriate explanation, citing any sources.  
  - **Fallback:** "I'm not sure. Ask your teacher."
- **Multi-lingual:** Return explanation in student's UI language while preserving subject terminology.  
- **History:** Log all Q&A for analytics and help teacher understand student confusion points.

### 6.4 Adaptive Practice Engine
- **Question bank:** System-generated questions per topic/difficulty, or teacher-uploaded.  
- **Difficulty adaptation:**  
  - Start at teacher-specified or inferred difficulty.  
  - Increase if 80%+ correct; decrease if <50% correct.  
  - Adapt within 2–3 questions.
- **Question types:** MCQ, short answer (text/number), fill-in-the-blank, formula/code (for STEM).  
- **Hint system:**  
  - Level 1 (general): "Think about [related concept]."  
  - Level 2 (specific): "Use [formula/method]."  
  - Level 3 (walkthrough): "Step 1: [instruction]. Step 2: [instruction]."  
  - Solution: Full worked example.
- **Feedback:** After each answer, explain correctness and link to related content.  
- **Analytics:** Log accuracy, time, hints used, error type (used to infer mastery and error patterns).

### 6.5 Mastery & Gap Detection
- **Mastery scoring:** Per student, per topic, on 0–100 scale (inferred from practice/homework accuracy).  
- **Gap definition:** Topics where mastery < 70% (configurable threshold).  
- **Error categorization:**  
  - Conceptual (misunderstanding of core idea).  
  - Procedural (correct concept, wrong method).  
  - Computational (right method, arithmetic error).  
  - Linguistic (understanding is fine, struggle with language/expression).
- **Recommendations:** Auto-suggest targeted practice for gaps; enrichment for strengths.

### 6.6 Collaborative Group Learning
- **Group formation:** Teacher assigns or system suggests students with complementary skills.  
- **Shared workspace:** Basic digital whiteboard (text + simple drawing).  
- **Rotation:** Students take turns explaining a concept to the group.  
- **System monitoring:**  
  - Detect if explanation is unclear (NLP + explicit feedback prompts).  
  - Offer suggestions: "Use an example," "Define that term."  
  - Award points for clear explanations and good questions.  
- **Post-session:** Generate summary of who explained, group performance, areas of confusion.

### 6.7 Gamification System
- **Points:** Earned for correct answers, peer help, group participation, consistency (daily streaks).  
- **Badges:** For milestones (e.g., "Master of Fractions," "Helper," "Consistent Learner").  
- **Leaderboards:** Optional per-class or school-wide; must be hideable to prevent negative competition.  
- **Streaks:** Days of consecutive engagement; displayed prominently.  
- **Display:** Gamification elements visible on Home screen, practice screen, and progress widgets.

### 6.8 Homework & Formative Assessment
- **Homework creation:** Teacher selects topics, difficulty, question types, due date.  
- **Student submission:** Work in system, save drafts, submit.  
- **Auto-grading:** System grades MCQ, numeric, and formula questions; teacher grades open-ended.  
- **Feedback:** Per-question feedback + overall summary.  
- **Resubmission:** Teacher can allow retakes; system shows improvement.  
- **Analytics:** Completion %, score distribution, error patterns per question.

### 6.9 Teacher Analytics & Recommendations
- **Class dashboard:** Class-wide snapshot (mastery, homework completion, risks).  
- **Student profiles:** Per-student details (strengths, gaps, error patterns, progress trend).  
- **Topic-level reports:** Which students struggle with which topics.  
- **Error analysis:** Common misconceptions in the class.  
- **Actionable recommendations:** "Reteach [topic]," "Enrich [group] with advanced problems," "Check in with [student]."  
- **Exportable reports:** CSV, PDF for parent meetings, team discussions.

### 6.10 Content Improvement Module (AI-Powered)
- **Supported formats:** PPTX, PDF, DOCX, plain text.  
- **Analysis capabilities:**  
  - **Readability:** Flesch-Kincaid Grade Level, sentence length analysis.  
  - **Pedagogy:** Check for warm-up, examples, formative assessment questions, summary.  
  - **Accessibility:** Font size, color contrast, alt-text presence.  
  - **Accuracy:** Domain-specific fact-checking (for STEM, history).  
  - **Clarity:** NLP-based detection of jargon, ambiguity, long sentences.

- **Suggestion presentation:** Side-by-side comparison with rationale.  
- **Accept/Reject workflow:** Teacher applies changes to create improved version.  
- **Outcome tracking:** After students use improved material, measure if clarity/mastery improved.  
- **Integration with Q&A:** Use improvement suggestions to pre-emptively clarify confusing content.

### 6.11 Multi-Lingual Support
- **UI languages:** Hebrew (RTL), English (LTR); both fully functional, switchable mid-session.  
- **Content language:** Agnostic; supports any language for lesson materials.  
- **Language handling in Q&A:**  
  - Question in student's language → answer in student's language (with subject terminology preserved).  
  - Example: Hebrew UI student asks "מה זה photosynthesis?" → receives explanation in Hebrew, term kept as "photosynthesis."

- **Future extensibility:** Architecture supports adding languages via translation files.

---

## 7. Technical Requirements

### 7.1 Architecture

**High-Level Stack:**
- **Frontend:** React (or Vue) with TypeScript; responsive CSS (Tailwind or Material-UI).  
- **Backend:** Node.js + Express (or Python + FastAPI).  
- **Database:** PostgreSQL (relational data).  
- **Cache:** Redis (sessions, frequently accessed data).  
- **Search:** Elasticsearch (full-text search across materials).  
- **File Storage:** Cloud storage (AWS S3, Google Cloud Storage, or on-prem).  
- **AI/NLP:** Third-party API (OpenAI GPT, or self-hosted model like Llama/BERT for on-prem option).  
- **Deployment:** Docker containers, Kubernetes (optional for scale), or managed platform (Vercel, Heroku for MVP).

**Microservices (Logical):**
- `auth-service`: Authentication and user management.  
- `content-service`: Material upload, organization, search.  
- `qa-service`: Q&A engine with NLP.  
- `practice-service`: Question generation, adaptation, grading.  
- `analytics-service`: Mastery inference, recommendations, reporting.  
- `improvement-service`: AI content improvement module.  
- `notification-service`: Alerts, messages (future).

### 7.2 Performance & Reliability
- **Page load time:** < 2 seconds on standard school broadband.  
- **Q&A response time:** < 5 seconds typical.  
- **Practice submission feedback:** < 2 seconds.  
- **Uptime:** 99.5% SLA (Phase 1), 99.9% (Phase 2+).  
- **Concurrency:** Support 500–1000 concurrent users per school in Phase 1; scale to 5000+ in Phase 2.  
- **Database backups:** Daily automated backups; restore point RTO < 1 hour, RPO < 5 minutes.

### 7.3 Security & Privacy
- **Authentication:** Strong password requirements, session timeout, "Remember me" hashing.  
- **Authorization:** Role-based; students see only their own data; teachers see class data only.  
- **Data encryption:** TLS 1.3 in transit; AES-256 at rest.  
- **Audit logs:** Log all sensitive actions (logins, grade changes, material edits).  
- **Privacy compliance:** GDPR (if EU students), Israeli Privacy Law (if Israel-based).  
- **Data minimization:** Collect only necessary data; clear logs after statutory retention period.

### 7.4 Accessibility
- **WCAG 2.1 AA compliance:**  
  - Keyboard navigation.  
  - Screen reader support.  
  - High-contrast mode.  
  - Adjustable font size (100%–200%).  
  - Focus indicators, ARIA labels.  
- **Multi-language font support:** Hebrew, Latin, math symbols.  
- **User preferences:** Persist theme, language, accessibility settings.

### 7.5 Scalability & Maintainability
- **Stateless backend:** Easy horizontal scaling.  
- **Database indexing:** Optimize queries for analytics (slow-changing data).  
- **Caching strategy:** Redis for session, user preferences; cache invalidation on updates.  
- **Monitoring:** Application logging (ELK stack, CloudWatch, etc.), error tracking (Sentry), performance monitoring (NewRelic).  
- **Deployment pipeline:** CI/CD (GitHub Actions, GitLab CI), automated tests, staging environment.

---

## 8. Development Roadmap & Phases

### 8.1 Phase 1 – Core MVP + Key Mockups (4–6 months)

**Primary Objectives:**
1. Validate core value: teacher uploads content → students learn and practice → teacher sees insights.  
2. Deliver working system with Mathematics and History fully featured.  
3. Demonstrate all major workflows via functional mockups and working prototypes.

**Deliverables:**

1. **UX Mockups & Prototypes (High-Fidelity):**  
   - Student Home Screen (HE & EN variants).  
   - Student Lesson Workspace.  
   - Student Practice & Hint Flow.  
   - Student Homework Submission.  
   - Teacher Dashboard (Class Overview + Student Profile).  
   - Teacher Content Management (with Improvement Module).  
   - Teacher Assignment Creation.  
   - Group Learning Session (student view + teacher review).  
   - Content Improvement Module (side-by-side suggestion UI).  
   - Clickable prototypes demonstrating all core flows.

2. **Working Backend & Frontend:**  
   - Authentication (student & teacher login, CSV import).  
   - Content upload & organization (at least slides/PDF).  
   - Q&A engine (basic NLP; leverage existing API or template).  
   - Practice generation & adaptation (Math + History templates).  
   - Hint system (3 levels + solution).  
   - Basic teacher dashboard (class overview, per-student mastery).  
   - Multi-lingual UI (Hebrew & English; RTL/LTR switching).  
   - Gamification (points, basic badges).  
   - Content Improvement Module (AI analysis + suggestion UI).

3. **Subject-Specific Scaffolding:**  
   - **Mathematics:** Full question generation, formula rendering, step-by-step solutions.  
   - **History:** Question templates, timeline UI, document references.  
   - **Other STEM/Humanities:** Templated support (shared infrastructure, minimal customization).

4. **Documentation & QA:**  
   - API documentation.  
   - User guides (teacher, student).  
   - Test plan and test cases.  
   - Accessibility audit (WCAG 2.1 AA).

**Success Criteria:**
- A teacher can, in < 30 min, set up a class, upload a math + history lesson, invite students, and see one practice session.  
- A student can, in < 5 min, ask a question and receive meaningful help.  
- Content Improvement Module suggests at least 5 improvements per material analyzed.  
- System supports Hebrew and English UI without layout issues (RTL/LTR).  
- 99.5% uptime over 2-week pilot.

---

### 8.2 Phase 2 – Enrichment & Advanced Analytics (3–4 months)

**Key Additions:**
- Full hint adaptation and mastery-based practice sequencing.  
- Richer teacher analytics: error patterns, trend analysis, recommendations.  
- Group learning and peer collaboration features.  
- Enrichment paths for strong students.  
- Extended subject support (Physics, Chemistry, Biology, Languages, Literature).  
- Performance optimization and scaling.

---

### 8.3 Phase 3 – School-Level Features & Extensibility (3–4 months)

**Key Additions:**
- Admin panel (manage multiple teachers, classes, schools).  
- Integration with external SIS (Google Classroom, Teams, Moodle).  
- Support for primary/middle school with age-appropriate themes.  
- Advanced reporting and curriculum mapping.  
- Professional development module for teachers.

---

## 9. Mockups & Wireframes

### 9.1 Key Screens to Design (Phase 1)
1. **Student Home Screen** – HE & EN versions.  
2. **Student Lesson Workspace** – showing Q&A integration.  
3. **Student Practice Screen** – with hint levels.  
4. **Student Homework Submission** – with status feedback.  
5. **Teacher Dashboard (Overview)** – with class metrics and student list.  
6. **Teacher Student Profile** – showing mastery map and error patterns.  
7. **Teacher Content Management** – with upload and improvement module.  
8. **Content Improvement Module** – side-by-side suggestion display.  
9. **Group Learning Session** – from student's perspective.  
10. **Group Learning Review** – from teacher's perspective.

### 9.2 Wireframe Style & Fidelity
- **Phase 1:** High-fidelity mockups (Figma, Adobe XD) showing realistic layouts, real copy, and all major interactions.  
- **Phase 2+:** Interactive prototypes with navigation between screens.  
- **Accessibility notes:** Annotations for color contrast, font sizes, ARIA labels.  
- **Multi-lingual:** Show both Hebrew (RTL) and English (LTR) layouts side-by-side for comparison.

---

## 10. Open Questions / Further Clarifications

1. **AI/NLP Backend:**  
   - Preferred approach: Use OpenAI API (GPT), self-hosted model (Llama, etc.), or hybrid?  
   - Privacy constraint: Can student/teacher data be sent to external API, or must everything run on-prem?

2. **Content Improvement Module Specifics:**  
   - Should "improvement suggestions" be optional for teachers (they can ignore them), or mandatory/pre-applied?  
   - Should the system also *auto-correct* common grammatical or clarity issues, or only suggest?

3. **Gamification Aggressiveness:**  
   - For high school, should leaderboards be class-wide, school-wide, or hidden by default?  
   - Should points be performance-based, effort-based, or both?

4. **Subject Matter Experts (SME) Review:**  
   - Who will validate that system-generated math problems and history questions are accurate and pedagogically sound?  
   - Timeline for SME review loops?

5. **Pilot School & Timeline:**  
   - Which school will be the pilot? (Affects final theming, language priorities, subject priorities.)  
   - When should Phase 1 MVP be ready for pilot deployment?

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **Mastery Score** | 0–100 rating of student competency per topic, inferred from practice/homework accuracy. |
| **Gap** | Topic where mastery < 70% (configurable). |
| **Hint Level** | Tier of guidance (Level 1: general, Level 2: specific, Level 3: step-by-step). |
| **Adaptive Practice** | Questions that adjust in difficulty based on student performance. |
| **Content Improvement** | AI-powered analysis and suggestions to enhance teaching materials. |
| **Peer Explanation** | Student explains a concept to classmates in a group session. |
| **Formative Assessment** | Low-stakes, frequent checks for understanding (vs. summative exams). |
| **RTL / LTR** | Right-to-Left (Hebrew) and Left-to-Right (English) text direction. |

---

## Appendix B: Success Metrics (Phase 1)

| Metric | Target | Measurement |
|--------|--------|------------|
| **Time to setup class** | < 30 min | Teacher setup flow in pilot school. |
| **Student question resolution time** | < 5 sec (mean) | System Q&A latency logs. |
| **Teacher satisfaction** | 4/5 stars | Post-pilot survey. |
| **Student engagement** | 80% weekly active users | Platform analytics. |
| **Mastery improvement** | +5–10% points (pre/post) | Compare baseline vs. post-Phase-1 test scores. |
| **Content improvement suggestions** | 5+ per material | Improvement module suggestion count. |
| **Uptime** | 99.5% | Monitoring dashboard SLA tracking. |
| **Accessibility compliance** | WCAG 2.1 AA | Automated + manual audit. |

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Next Review:** Monthly during Phase 1 development.