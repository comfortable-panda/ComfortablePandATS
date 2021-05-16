# ComfortablePandATS
A browser extention that makes PandA life comfortable

# Installation links
- [Google Chrome](https://chrome.google.com/webstore/detail/comfortable-panda/cecjhdkagakhonnmddjgncmdldmppnoe)
- [Firefox](https://public.tinax.work/~tinaxd/cpff/)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/njbljhcmnodocldppoiejkcmcebpmljc)


# Manual installation(not recommended)
1. Go to `chrome://extensions/` on your GoogleChrome
1. Enable **developer mode**.
1. Click **LOAD UNPACKED** button on upper left hand corner.
1. Select this folder(comfortable-panda) and install.
1. You are all set:)

# How to compile
Run
```
npx webpack
```
in the root directory of cloned repository.

# Usage
1. Login to PandA
1. Proceed to main page.
1. Done. Your upper tab color is changed and ☰ icon is displayed.

# Features
## Tab coloring
Colors lecture tab according to due date.
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

# Screenshot
![](https://user-images.githubusercontent.com/41512077/90533356-5504e080-e1b3-11ea-8065-bc10ec624ddf.png)

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

# License
MIT
