# ArcJet-LD-Demo
tutorial on how to use ArcJet with LaunchDarkly for rate limiting.

### Core Functionality:

User selects a celebrity from a predefined list
User chooses a harsh environment from a set of options
App generates an AI-powered survival scenario and outcome

### User Roles and Rate Limits:

Director: unlimited
not Director: no rate limits

### LaunchDarkly will handle:

User role assignment
Feature flag for enabling/disabling certain celebrities or environments

### ArcJet will manage:

Rate limiting based on the user's role
