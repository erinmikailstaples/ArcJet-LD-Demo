# ArcJet-LD-Demo
tutorial on how to use ArcJet with LaunchDarkly for rate limiting.

### Core Functionality:

User selects a celebrity from a predefined list
User chooses a harsh environment from a set of options
App generates an AI-powered survival scenario and outcome

### User Roles and Rate Limits:

Couch Potato: 3 scenarios per hour
Survivalist Fanatic: 10 scenarios per hour
Reality TV Producer: 20 scenarios per hour

### LaunchDarkly will handle:

User role assignment
Feature flag for enabling/disabling certain celebrities or environments

### ArcJet will manage:

Rate limiting based on the user's role
