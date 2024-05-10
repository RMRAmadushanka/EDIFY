/**
 * express router for auth related application programing interfaces
 */
import { Router } from 'express';
import * as authController from '../controller/auth.controller.js';

export default function(keycloak) {
const router = Router();

router.post('/login',  authController.login)
router.post('/logout', keycloak.protect() , authController.logout);
return router;
}