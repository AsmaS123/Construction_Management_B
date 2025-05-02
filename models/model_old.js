const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Attendance Schema
var AttendanceSchema = new Schema({
 userId: {type:String, required: true,unique:false},
 date: {type: Date, required: true},
 status: {type:String, required: true},
    },
    {
    timestamps: true
});

const Attendance =  mongoose.model("Attendance", AttendanceSchema);

//Student Schema
var StudentSchema = new Schema({
    studentId: {type:String, required: true,unique:true}, //PK
    email:{type:String, required:true,unique:true},
    password:{type:String},
    name:{type:String, required:true},
    dob: {type: Date, required: true},
    gender:{type:String, required:true},
    address:{type:String, required:true},
    phone:{type:String, required:true},
    date_of_join: {type: Date, required: true},
    parent_name:{type:String, required:true},
    issue_id: [{ type: Schema.Types.ObjectId, ref: 'Issue' }],
    classroom_id: [{ type: Schema.Types.ObjectId, ref: 'Classroom' }],
    },
    {
    timestamps: true
   });

const Student = mongoose.model("Student", StudentSchema);

//Teacher Schema
var TeacherSchema = new Schema({
    teacherId: {type: String, required: true,unique:true}, //PK
    email:{type:String, required:true,unique:true},
    name:{type:String, required:true},
    dob: {type: Date, required: true},
    gender:{type:String, required:true},
    address:{type:String, required:true},
    phone:{type:String, required:true},
    date_of_join: {type: Date, required: true}
   },
    {
    timestamps: true
    }
    );
    
const Teacher =  mongoose.model("Teacher", TeacherSchema);

// //Issue Schema
var IssueSchema = new Schema({
    issueId: {type: String, required: true,unique:true}, //FK
    type:{type:String, required:true,unique:true},
    details:{type:String, required:true,unique:true},
    is_resolved: {type: Boolean, required: true},
    student_id: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    },
    {
    timestamps: true
   });

const Issue =  mongoose.model("Issue", IssueSchema);

// //Classroom Schema
var CreateClassroomSchema = new Schema({
    classroomId: {type: String},    //PK   
    section:{type:String, required:true},  
    grade:{type:Number, required:true},
    teacher_id: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    timetable_id: { type: Schema.Types.ObjectId, ref: 'Timetable' },
    student_id: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    },
    {
    timestamps: true
   });

const Classroom =  mongoose.model("Classroom", CreateClassroomSchema);

//Subject Schema
var SubjectSchema = new Schema({
    subjectId: {type: String, required: true,unique:true},    //PK
    name:{type:String, required:true},
    grade:{type: Number },
    description:{type:String},
    classroom_id:{type: mongoose.Schema.Types.ObjectId,required: true, ref: 'Classroom' },
    },
    {
    timestamps: true
   });
const Subject =  mongoose.model("Subject", SubjectSchema);


//Result Schema
var CreateResultSchema = new Schema({
    // exam_id: {type: Number, required: true,unique:true},    //PK
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam',required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student',required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject',required: true },
    marks:{type:Number, required:true},
    },
    {
    timestamps: true
   });

const Result =  mongoose.model("Result", CreateResultSchema);

//Exam Schema
var CreateExamSchema = new Schema({
    examId: {type: String, required: true,unique:true},    //PK
    date:{type:Date, required:true,unique:true},   
    name:{type:String, required:true,unique:true}, 
    type:{type:Number, required:true,unique:true},
    },
    {
    timestamps: true
   });

const Exam =  mongoose.model("Exam", CreateExamSchema);

// //Timetable Schema
var CreateTimetableSchema = new Schema({
    timeTableId: {type: String, required: true,unique:true},    //FK
    day:{type:String, required:true},   
    time:{type:String, required:true},   
    subject:{type:String, required:true},
    grade:{type:Number, required:true},
    },
    {
    timestamps: true
   });

const Timetable =  mongoose.model("Timetable", CreateTimetableSchema);

module.exports = {Attendance,Student, Teacher, Classroom ,Subject,Timetable,Exam, Result}






//Classroom Student Schema
// var ClassroomStudentSchema = new Schema({
//     student_id: {type: Number, required: true,unique:true},    //FK
//     classroom_id: {type: Number, required: true,unique:true},  //FK
//    });

// const ClassroomStudents =  mongoose.model("ClassroomStudent", ClassroomStudentSchema);
// module.exports =  mongoose.model("ClassroomStudent", ClassroomStudentSchema);