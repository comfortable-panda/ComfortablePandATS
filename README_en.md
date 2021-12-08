# ComfortablePandATS
[![License](https://img.shields.io/github/license/comfortable-panda/ComfortablePandATS?color=orange)](https://github.com/comfortable-panda/ComfortablePandATS/blob/master/LICENSE)
[![Release](https://img.shields.io/github/v/release/comfortable-panda/ComfortablePandATS?include_prereleases)](https://github.com/comfortable-panda/ComfortablePandATS/releases)
[![CodeQL](https://github.com/comfortable-panda/ComfortablePandATS/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/comfortable-panda/ComfortablePandATS/actions/workflows/codeql-analysis.yml)  

A Web browser extention that makes PandA life comfortable.  
**ONLY WORKS IN PandA**. Use [Comfortable-Sakai](https://github.com/kyoto-u/comfortable-sakai) for other Sakai LMS.

## Readme
English | [Japanese](https://github.com/comfortable-panda/ComfortablePandATS/blob/master/README.md)

## Comfortable Sakai Project
This is a project to re-create Comfortable PandA to work with other Sakai LMS websites, and to contribute to Sakai Community.
Developing in the repository of Kyoto University.
[Comfortable-Sakai](https://github.com/kyoto-u/comfortable-sakai)

# Installation links
**ONLY WORKS IN PandA**. Use [Comfortable-Sakai](https://github.com/kyoto-u/comfortable-sakai) for other Sakai LMS.  
- [Google Chrome Store](https://chrome.google.com/webstore/detail/comfortable-panda/cecjhdkagakhonnmddjgncmdldmppnoe)
- [Firefox](https://tinaxd.github.io/comfortable-panda-firefox-updates/index.html)
- [Microsoft Edge Store](https://microsoftedge.microsoft.com/addons/detail/njbljhcmnodocldppoiejkcmcebpmljc)


# Manual installation(not recommended)
1. Download latest version of `Comfortable-PandA.zip` from [HERE](https://github.com/comfortable-panda/ComfortablePandATS/releases/tag/v3.5.2).
2. Unzip `Comfortable-PandA.zip`.
3. Go to `chrome://extensions/` on your Google Chrome.
4. Enable **developer mode**.
5. Click **LOAD UNPACKED** button on upper left corner.
6. Select the folder you unzipped and install.
7. You are ready to use :)

# Usage
1. Login to PandA
1. Proceed to main page.
1. Done. Your upper tab color is changed and ☰ icon is displayed.

# Features
## Color-coded course site tabs
Colors course site tabs according to the assignment due date.
- ![#f03c15](https://via.placeholder.com/15/e85555/000000?text=+)
  Due date <= 1 Day ahead
- ![#f03c15](https://via.placeholder.com/15/d7aa57/000000?text=+)
  Due date <= 5 Days ahead
- ![#f03c15](https://via.placeholder.com/15/62b665/000000?text=+)
  Due date <= 14 Days ahead

## Notification Badge
Tells your unchecked latest assignments.

If you open lecture page with notification badge on, the badge will disappear.

## miniPandA (Side-menu)
Click ☰ to open miniPandA.
All available assignments as well as quizzes will be displayed.
You can add your custom assignment to miniPandA with PLUS button located on the upper right hand side.

Also check box is available for you to distinguish completed assignments from working assignments.

## Cache
In order to reduce the network load on PandA, we have implemented a cache function for getting assignments and quizzes.
The default cache interval is as follows
- Assignment fetching --- 2 minutes
- Quiz fetching --- 10 minutes  

The cache time can be changed in the configuration.

# Screenshot
![](https://user-images.githubusercontent.com/41512077/140854635-974aee4b-fea3-4051-8956-ac696d1648ec.png)

# Update Log
- 2020/05/20 v0.9.0 Prototype release
- 2020/05/21 v1.0.0 Release
- 2020/05/22 v1.0.1 Fixed some minor bugs & refactored
- 2020/05/26 v1.0.2 Fixed notification badge related bug
- 2020/06/10 v1.1.0 Added side menu for displaying all available kadais.
- 2020/06/11 v1.1.3 Minor bug fix & enhancement.
- 2020/06/13 v1.2.0 Added check button.
- 2020/06/23 v1.3.0 Added quiz/exam tab.
- 2020/06/24 v1.3.1 Fixed bug.
- 2020/06/30 v1.4.0 Add custom todo.
- 2020/08/16 v1.4.1 Removed redundant lines.
- 2020/08/17 v1.5.0 Added relax PandA and spinning wheel.
- 2020/10/02 v1.5.2 Fixed badge reset bug.
- 2020/10/25 v1.6.0 Add cache.
- 2020/10/28 v1.6.1 Using async on storage.get
- 2020/12/22 v1.7.0 Order assignments by closestTime.
- 2021/03/28 v2.0.0 Support for Sakai21.
- 2021/04/10 v2.1.0 Fixed errors.
- 2021/04/13 v3.0.0 Re-wrote everything using Typescript.
- 2021/04/13 v3.0.4 Bug fix.
- 2021/04/13 v3.1.0 Bug fix.
- 2021/05/05 v3.2.0 SubPandA first release.
- 2021/05/15 v3.3.0 Add quiz-fetch feature.
- 2021/05/16 v3.4.0 Add setting tab.
- 2021/05/16 v3.4.1 Fixed minor bugs.
- 2021/05/17 v3.5.0 Support for color universal design.
- 2021/05/17 v3.5.2 Color code assignments with due date more than 14days

# How to compile from source code
Run
```
npx webpack
```
in the root directory of cloned repository.

# License
Apache-2.0 License
