import {Invoices} from "/imports/api/collections/both/invoices.js";
import {Classrooms} from "/imports/api/collections/both/classrooms.js";

// Invoices
Invoices.join(Classrooms, "classroomId", "classroom", ["name"]);

