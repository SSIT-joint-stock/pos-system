import { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';

interface ExtendedLinkProps extends LinkProps {
	className?: string;
	children: React.ReactNode;
}

const RouterLink = forwardRef<HTMLAnchorElement, ExtendedLinkProps>(
	({ href, className, children, ...other }, ref) => (
		<Link href={href} ref={ref} {...other} className={className}>
			{children}
		</Link>
	)
);

RouterLink.displayName = 'RouterLink';

export default RouterLink;
