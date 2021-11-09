# Comfortable Sakai
A Web browser Extension for improving UX of Sakai LMS.

# 動作保証
- Sakai 20, 21(安定)
- Sakai 12(β版)


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

If you open a course site with the notification badge on, the badge will disappear.

## miniSakai (List of assignments and quizzes)
Click `☰` to open miniSakai.
All available assignments as well as quizzes will be displayed.
You can add your custom assignment to miniSakai as `memo` with PLUS button located on the upper right side.

Also check box is available for you to distinguish completed assignments from working assignments.

## Cache
In order to reduce the network load on PandA, we have implemented a cache function for getting assignments and quizzes.
The default cache interval is as follows
- Assignment fetching --- 2 minutes
- Quiz fetching --- 10 minutes

The cache time can be changed in the configuration.

# How to compile from source code
Run
```
npx webpack
```
in the root directory of cloned repository.

# How to run tests
```
npm test
```

# License
Apache-2.0 License
