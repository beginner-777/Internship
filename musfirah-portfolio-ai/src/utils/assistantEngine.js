import { education, experience, profile, projects, skills } from '../data/portfolioData';

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9+ ]/g, ' ');

export function getAssistantResponse(input) {
  const query = normalize(input);

  if (/project|client|curtain|work/.test(query)) {
    const project = projects[0];
    return `${project.title} is a ${project.type.toLowerCase()} completed in ${project.date}. Musfirah delivered a responsive bilingual interface with mobile navigation, business sections, contact actions and curtain-inspired animation, then deployed it on Vercel.`;
  }

  if (/react|frontend|technology|technologies|skill|stack|know/.test(query)) {
    const frontend = skills.find((group) => group.group === 'Frontend systems');
    return `Her verified frontend toolkit includes ${frontend.items.join(', ')}. She also works with Git, GitHub, Vercel, technical SEO, UI implementation and cross-device testing.`;
  }

  if (/hire|why|strength|value/.test(query)) {
    return 'Musfirah combines practical client delivery with a strong learning trajectory: she has shipped a paid responsive website, works in a Frontend AI Engineering internship, iterates carefully from feedback and already treats mobile quality and usability as engineering responsibilities.';
  }

  if (/education|university|cgpa|study/.test(query)) {
    return `${education.degree} at ${education.school}, ${education.period}. She has ${education.standing.toLowerCase()} with a ${education.cgpa} CGPA.`;
  }

  if (/experience|intern|flyrank/.test(query)) {
    return `${experience[0].role} at ${experience[0].company}, ${experience[0].period}. Her work covers responsive components, requirements translation, version control, layout checks and structured usability iteration.`;
  }

  if (/contact|email|location|reach/.test(query)) {
    return `Musfirah is based in ${profile.location}. You can reach her at ${profile.email} or use the Contact node in this workspace.`;
  }

  if (/about|musfirah|developer|who/.test(query)) return profile.summary;

  return 'I can retrieve verified details about Musfirah’s experience, client project, frontend skills, education, contact details, or reasons she may fit your team. Try asking about one of those areas.';
}
