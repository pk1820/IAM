# Let me analyze the code structure and identify key issues
import json

# Create a comprehensive code review analysis
code_review = {
    "security_issues": [
        {
            "file": "auth.js",
            "issue": "Hardcoded sensitive credentials",
            "severity": "CRITICAL",
            "description": "Okta domain, client ID, and redirect URI are hardcoded in client-side code",
            "line_reference": "Lines 11-17",
            "recommendation": "Move sensitive configuration to environment variables or secure server-side endpoint"
        },
        {
            "file": "auth.js", 
            "issue": "Syntax error in configuration object",
            "severity": "HIGH",
            "description": "Missing closing brace in helpLinks object causing runtime errors",
            "line_reference": "Lines 36-43",
            "recommendation": "Fix syntax by adding missing closing brace"
        },
        {
            "file": "auth.js",
            "issue": "Insufficient error handling",
            "severity": "MEDIUM", 
            "description": "Silent failures in authentication state checking",
            "line_reference": "checkAuthState method",
            "recommendation": "Add proper error logging and user feedback"
        }
    ],
    
    "performance_issues": [
        {
            "file": "app.js",
            "issue": "Multiple DOM queries",
            "severity": "MEDIUM",
            "description": "Repeated querySelector calls without caching",
            "recommendation": "Cache DOM elements in constructor or init methods"
        },
        {
            "file": "app.js",
            "issue": "Excessive session checking",
            "severity": "LOW",
            "description": "Session validation every 5 minutes may be too frequent",
            "line_reference": "Line ~700",
            "recommendation": "Consider increasing interval to 15-30 minutes"
        }
    ],
    
    "maintainability_issues": [
        {
            "file": "auth.js",
            "issue": "Missing JSDoc documentation", 
            "severity": "MEDIUM",
            "description": "Complex authentication logic lacks proper documentation",
            "recommendation": "Add comprehensive JSDoc comments for all methods"
        },
        {
            "file": "app.js",
            "issue": "Code duplication",
            "severity": "MEDIUM", 
            "description": "Similar DOM manipulation patterns repeated across classes",
            "recommendation": "Create utility functions for common DOM operations"
        }
    ],
    
    "ui_ux_issues": [
        {
            "file": "style.css",
            "issue": "Accessibility concerns",
            "severity": "MEDIUM",
            "description": "Insufficient color contrast ratios and missing focus indicators",
            "recommendation": "Ensure WCAG 2.1 AA compliance for accessibility"
        },
        {
            "file": "index.html",
            "issue": "Missing semantic HTML",
            "severity": "LOW",
            "description": "Limited use of semantic HTML5 elements",
            "recommendation": "Use proper semantic tags like <main>, <article>, <section>"
        }
    ]
}

print("=== PROKODE LABS CODE REVIEW SUMMARY ===")
print(f"Security Issues: {len(code_review['security_issues'])}")
print(f"Performance Issues: {len(code_review['performance_issues'])}")  
print(f"Maintainability Issues: {len(code_review['maintainability_issues'])}")
print(f"UI/UX Issues: {len(code_review['ui_ux_issues'])}")
print(f"\nTotal Issues Found: {sum(len(issues) for issues in code_review.values())}")

# Export findings to CSV for detailed review
import csv

all_issues = []
for category, issues in code_review.items():
    for issue in issues:
        issue_data = {
            'Category': category.replace('_', ' ').title(),
            'File': issue['file'],
            'Issue': issue['issue'], 
            'Severity': issue['severity'],
            'Description': issue['description'],
            'Recommendation': issue['recommendation'],
            'Line_Reference': issue.get('line_reference', 'N/A')
        }
        all_issues.append(issue_data)

with open('code_review_findings.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Category', 'File', 'Issue', 'Severity', 'Description', 'Recommendation', 'Line_Reference']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    writer.writeheader()
    for issue in all_issues:
        writer.writerow(issue)

print("\n✅ Code review findings exported to CSV file")