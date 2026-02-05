
import * as React from "react";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Link,
    Hr,
    Img,
} from "@react-email/components";

export const WelcomeEmail = () => (
    <Html>
        <Head />
        <Preview>Welcome to TechStore - The Future of Tech is Here!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={logo}>TechStore</Heading>
                </Section>
                <Section style={content}>
                    <Heading style={h1}>Welcome to the TechStore Family! 🚀</Heading>
                    <Text style={text}>
                        Hi there,
                    </Text>
                    <Text style={text}>
                        Thank you for subscribing to our newsletter! We're thrilled to have you on board.
                        You're now part of an exclusive community of tech enthusiasts who get first access to:
                    </Text>
                    <ul style={list}>
                        <li style={listItem}>🔥 Exclusive deals and early-bird discounts</li>
                        <li style={listItem}>📱 Updates on the latest gadgets and gear</li>
                        <li style={listItem}>💡 Expert reviews and tech tips</li>
                    </ul>
                    <Section style={btnContainer}>
                        <Link style={button} href="http://localhost:3000/products">
                            Start Exploring
                        </Link>
                    </Section>
                    <Text style={text}>
                        Stay tuned! We'll be sending some amazing tech goodness your way soon.
                    </Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        TechStore, Inc. • 123 Innovation Drive, Silicon Valley, CA 94025
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    maxWidth: "600px",
};

const header = {
    padding: "32px",
    textAlign: "center" as const,
    borderBottom: "1px solid #e6ebf1",
};

const logo = {
    color: "#0f172a",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0",
    textTransform: "uppercase" as const,
    letterSpacing: "-0.5px",
};

const content = {
    padding: "48px 48px 20px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
};

const text = {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "left" as const,
};

const list = {
    paddingLeft: "20px",
    marginTop: "24px",
    marginBottom: "24px",
};

const listItem = {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "26px",
    marginBottom: "10px",
};

const btnContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
    marginBottom: "32px",
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "16px 36px",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center" as const,
};
