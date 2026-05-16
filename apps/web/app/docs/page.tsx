import { redirect } from 'next/navigation';

export default function DocsRedirect() {
  redirect('http://localhost:3001/docs');
}
