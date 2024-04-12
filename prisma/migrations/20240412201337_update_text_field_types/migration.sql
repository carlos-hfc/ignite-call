-- AlterTable
ALTER TABLE `accounts` MODIFY `refreshToken` TEXT NULL,
    MODIFY `accessToken` TEXT NULL,
    MODIFY `idToken` TEXT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `bio` TEXT NULL;
