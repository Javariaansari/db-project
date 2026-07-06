// backend/utils/gpaUtils.js

/**
 * Convert percentage marks into a letter grade and grade point.
 * Standard 4.0 scale grading table.
 */
function calculateGrade(marksObtained, totalMarks) {
  const percentage = (Number(marksObtained) / Number(totalMarks)) * 100;

  let grade = "F";
  let gradePoint = 0.0;

  if (percentage >= 85) {
    grade = "A+";
    gradePoint = 4.0;
  } else if (percentage >= 80) {
    grade = "A";
    gradePoint = 4.0;
  } else if (percentage >= 75) {
    grade = "A-";
    gradePoint = 3.7;
  } else if (percentage >= 71) {
    grade = "B+";
    gradePoint = 3.4;
  } else if (percentage >= 68) {
    grade = "B";
    gradePoint = 3.0;
  } else if (percentage >= 64) {
    grade = "B-";
    gradePoint = 2.7;
  } else if (percentage >= 61) {
    grade = "C+";
    gradePoint = 2.4;
  } else if (percentage >= 58) {
    grade = "C";
    gradePoint = 2.0;
  } else if (percentage >= 54) {
    grade = "C-";
    gradePoint = 1.7;
  } else if (percentage >= 50) {
    grade = "D";
    gradePoint = 1.0;
  } else {
    grade = "F";
    gradePoint = 0.0;
  }

  return { grade, gradePoint, percentage: Number(percentage.toFixed(2)) };
}

/**
 * Semester GPA = total quality points / total credit hours
 * qualityPoints for a subject = gradePoint * creditHours
 */
function calculateSemesterGPA(results) {
  let totalQualityPoints = 0;
  let totalCreditHours = 0;

  results.forEach((r) => {
    const credit = Number(r.credit_hours);
    const gp = Number(r.grade_point);
    totalQualityPoints += gp * credit;
    totalCreditHours += credit;
  });

  if (totalCreditHours === 0) return 0;
  return Number((totalQualityPoints / totalCreditHours).toFixed(2));
}

/**
 * CGPA = sum of all semester quality points / sum of all credit hours
 * (across every semester the student has taken so far)
 */
function calculateCGPA(allSemesterResults) {
  let totalQualityPoints = 0;
  let totalCreditHours = 0;

  allSemesterResults.forEach((r) => {
    const credit = Number(r.credit_hours);
    const gp = Number(r.grade_point);
    totalQualityPoints += gp * credit;
    totalCreditHours += credit;
  });

  if (totalCreditHours === 0) return 0;
  return Number((totalQualityPoints / totalCreditHours).toFixed(2));
}

module.exports = { calculateGrade, calculateSemesterGPA, calculateCGPA };
