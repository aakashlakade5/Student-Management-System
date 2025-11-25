import {body, validationResult} from 'express-validator'

export const studentValidationRules = [
    
        
        body('name')
        .notEmpty().withMessage('Student ID is required'),

        body('schClass')
        .isInt({ min: 1, max: 12 }).withMessage('Class is 1 to 12')
        .notEmpty().withMessage('Class is required'),

        body('section')
        .trim()
        .notEmpty().withMessage('Section is required')
        .customSanitizer(value => value.toUpperCase())
        .matches(/^[A-Z]$/)
        .withMessage('Section must be a single letter from A to Z'),

        // body('marksMarathi')
        // .isInt({ min: 0, max: 100 }).withMessage('Student Marks must have less than 100'),

        // body('marksHindi')
        // .isInt({ min: 0, max: 100 }).withMessage('Student Marks must have less than 100'),

        // body('marksEVS')
        // .isInt({ min: 0, max: 100 }).withMessage('Student Marks must have less than 100'),

        // body('marksMath')
        // .isInt({ min: 0, max: 100 }).withMessage('Student Marks must have less than 100'),


]


export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //   res.send(errors)
    return res.status(400).render('errorHandling/400', {
      title: 'Validation Error',
      message: errors.array()
    });
}
// res.send(req.body)
  next();
};
