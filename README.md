# CSE Capstone Project - *Get Me Out*
Welcome to the CSE Capstone Project for *Get Me Out*! This repository is the foundation for the capstone development effort.

### Key Links:
- **Repository HTTPS URL**: [https://github.com/sevkliyf/getMeOut.git](https://github.com/sevkliyf/getMeOut.git)
- **Repository SSH URL**: `git@github.com:sevkliyf/getMeOut.git`
- **Old Project Wiki**: [Git clone command](git@gitlab.csi.miamioh.edu:2024-capstone/lifeshare/lifeshare.wiki.git)
- **New Server IP**: `52.21.65.34`
- **Server Deployment Script**: To update & restart the server, run: `/var/www/getMeOut/scripts/deploy.sh`

## Project Overview
*Get Me Out* aims to provide a tool for users to exit certain situations quickly by using a browser extension. The extension should trigger actions based on an HTTPS request sent from a remote site, while also modifying the user's browsing history.

### Pre-Development Considerations for Exit Extension:
- The extension should react to an HTTPS request from a remote site.
- The extension should be able to modify the user's history to facilitate exiting or switching tasks efficiently.

---

## Project Structure

### **Tech Stack:**
The tech stack includes a modern web development stack, with a focus on clean design and functionality:

- **Web Server Options**:
  - **Apache**: Popular and well-supported, but has higher memory usage.
  - **Caddy**: Automatically handles HTTPS configuration and is lightweight, but lacks extensive documentation.
  - **Nginx**: Efficient, handles concurrent requests well, and is highly scalable. We’ve chosen Nginx for its speed, efficiency, and strong online documentation.

- **Website Design**:
  The goal is to create a clean, user-friendly website with a focus on user experience. We’re using a purple color palette to align with the cause of raising awareness for domestic violence, as purple is often used to represent this issue. This will establish a visual connection to the core mission of the project.

  **Color Palette**: The color scheme was carefully selected to provide consistency and relevance to the cause:
  - **Primary Color**: Purple (to represent domestic violence awareness)
  - **Other Colors**: A well-defined set of complementary colors for design harmony. You can view the full palette and fonts [here](https://www.realtimecolors.com/?colors=24021c-fffbf6-BC67CB-F5B8C8-9533EB&fonts=Inter-Inter).

  **Typography**: The design prioritizes readability with a good balance of headings and body text.

  **Responsive Design**: The website will be fully responsive to ensure it adapts seamlessly to different devices, providing a pleasant user experience.

- **Brochure Design**: To further promote the cause, the brochure design follows the same color palette as the website for consistency. You can view the brochure draft on [Canva](https://www.canva.com/design/DAGbzFq34lw/QMtO1t_80gh-UQH1swiK3A/edit?utm_content=DAGbzFq34lw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton).

---

<<<<<<< HEAD
## GitLab Usage

### **Issues and Collaboration**:
We will use GitLab Issues extensively for tracking project tasks, research questions, and discussions. Each research question or feature should have a corresponding issue that’s tracked, with comments and collaboration helping to build a knowledge base throughout the project.

To get started with GitLab:
- **[How to use GitLab for Agile Software Development](https://about.gitlab.com/blog/2018/03/05/gitlab-for-agile-software-development/)**
- **[How to Write a Beautiful and Meaningful README.md](https://blog.bitsrc.io/how-to-write-beautiful-and-meaningful-readme-md-for-your-next-project-897045e3f991#:~:text=It's%20a%20set%20of%20useful,github%20below%20the%20project%20directory.)**
- **[Always Start with an Issue](https://about.gitlab.com/blog/2016/03/03/start-with-an-issue/)**: Tips on how to structure issues for collaboration.

---

## Time Tracking (Optional)

While time tracking isn’t mandatory, GitLab provides simple commands to track time spent on issues:

| Command       | Purpose                                                |
| ------------- | ------------------------------------------------------- |
| `/estimate`   | Estimate time for the task in days, hours, or minutes.  |
| `/spend`      | Record time spent working on the issue.                |

For more on quick actions, visit the [Quick Actions documentation](https://docs.gitlab.com/ee/user/project/quick_actions.html).

---

## Branch Strategy

This project template includes two primary branches:

| **Branch Name** | **Description** |
| --------------- | --------------- |
| `master`        | The protected branch for production-ready code. You cannot push directly to `master`. It should reflect the final product deployed to your test server (e.g., ceclnx). |
| `sprint-branch` | Each sprint should have its own branch derived from `master`. Feature branches should be created from the sprint branch. If an issue is incomplete by the end of the sprint, it should be moved to the next sprint branch for continued development. |

This strategy ensures that the `master` branch remains stable and protected.

---

## Additional Resources
- **[Template Samples for Issues and Merge Requests](https://gitlab.com/gitlab-org/gitlab/-/tree/master/.gitlab/issue_templates)**: Ready-to-use templates that you can adapt for your project’s needs.

---

## Conclusion
Keep this README up-to-date as the project progresses. As you implement features, iterate on the design, or refine documentation, update this document to provide clear, accessible information for your team and anyone else who may interact with the project.