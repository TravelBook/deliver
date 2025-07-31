import { isValidJpnPhoneNumber, isTooSequential } from '../src/valid-jpn-phone-number';

describe('Japanese Phone Number Validation', () => {
  describe('Valid phone numbers', () => {
    it('should accept valid 10-digit phone numbers', () => {
      const validNumbers = [
        '0312345678',  // Tokyo landline - only 6 sequential (2-7)
        '0612345678',  // Osaka landline - only 6 sequential (2-7)
        '0451234567',  // Yokohama landline - only 7 sequential (1-7)
        '0312345679',  // Different last digit
        '0312764598',  // Non-sequential pattern
      ];

      validNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(true);
      });
    });

    it('should accept valid 11-digit mobile phone numbers', () => {
      const validNumbers = [
        '09012365478',  // Mobile - non-sequential
        '08012365478',  // Mobile - non-sequential
        '07012365478',  // Mobile - non-sequential
        '05012365478',  // Old mobile format - non-sequential
        '09087654312',  // Different pattern - only 6 descending (9-4)
      ];

      validNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(true);
      });
    });
  });

  describe('Invalid phone numbers - Format validation', () => {
    it('should reject numbers with non-digit characters', () => {
      const invalidNumbers = [
        '090-1234-5678',  // With hyphens
        '090 1234 5678',  // With spaces
        '090.1234.5678',  // With dots
        '090(1234)5678',  // With parentheses
        '090a1234567',    // With letters
        '+8109012345678', // With country code
        '０９０１２３４５６７８', // Full-width numbers
      ];

      invalidNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });

    it('should reject numbers with invalid length', () => {
      const shortNumbers = [
        '123456789',    // 9 digits
        '12345678',     // 8 digits
        '0123456',      // 7 digits
        '090123456',    // 9 digits
      ];

      const longNumbers = [
        '090123456789',   // 12 digits
        '0901234567890',  // 13 digits
        '09012345678901', // 14 digits
      ];

      [...shortNumbers, ...longNumbers].forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });

    it('should reject numbers not starting with 0', () => {
      const invalidNumbers = [
        '1901234567',   // Starts with 1
        '2901234567',   // Starts with 2
        '9012345678',   // Starts with 9
        '19012345678',  // 11-digit starting with 1
        '89012345678',  // 11-digit starting with 8
      ];

      invalidNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });

    it('should reject numbers starting with 00', () => {
      const invalidNumbers = [
        '0012345678',   // 10 digits starting with 00
        '00123456789',  // 11 digits starting with 00
        '0000000000',   // All zeros
      ];

      invalidNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });
  });

  describe('Invalid phone numbers - Pattern validation', () => {
    it('should reject numbers with all same digits', () => {
      const invalidNumbers = [
        '0000000000',   // All zeros (10 digits)
        '1111111111',   // All ones (10 digits)
        '2222222222',   // All twos (10 digits)
        '00000000000',  // All zeros (11 digits)
        '11111111111',  // All ones (11 digits)
        '99999999999',  // All nines (11 digits)
      ];

      invalidNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });

    it('should reject numbers with 7+ repeated digits at the end', () => {
      const invalidNumbers = [
        '0300000000',   // 7 zeros at end (10 digits)
        '03000000000',  // 8 zeros at end (11 digits)
        '0311111111',   // 7 ones at end (10 digits)
        '03111111111',  // 8 ones at end (11 digits)
        '0322222222',   // 7 twos at end (10 digits)
        '09000000000',  // 8 zeros at end (mobile)
        '09111111111',  // 8 ones at end (mobile)
      ];

      invalidNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });

    it('should accept numbers with 6 or fewer repeated digits at the end', () => {
      const validNumbers = [
        '0312000000',   // 6 zeros at end (10 digits)
        '09012000000',  // 6 zeros at end (11 digits)
        '0312111111',   // 6 ones at end (10 digits)
        '09012111111',  // 6 ones at end (11 digits)
      ];

      validNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(true);
      });
    });

    it('should reject numbers with 8+ sequential ascending digits', () => {
      const invalidNumbers = [
        '0123456789',   // 10 digits: 0-9 sequence (10 sequential)
        '01234567890',  // 11 digits: 0-9-0 sequence (10 sequential then breaks)
        '09012345678',  // 8 sequential digits: 0-1-2-3-4-5-6-7
        '0987654321',   // 10 descending sequential digits
      ];

      invalidNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });

    it('should reject numbers with 8+ sequential descending digits', () => {
      const invalidNumbers = [
        '0987654321',   // 10 digits: 9-0 sequence
        '09876543210',  // 11 digits: 9-0 sequence
        '0987654321',   // 10 descending digits
      ];

      invalidNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(false);
      });
    });

    it('should accept numbers with 7 or fewer sequential digits', () => {
      const validNumbers = [
        '0312345678',   // Only 6 sequential digits (2-7)
        '0901234567',   // Only 7 sequential digits (0-6)
        '0987654312',   // Only 6 descending digits (9-4)
        '0312765432',   // Only 5 descending digits (7-3)
        '0812345678',   // 7 sequential digits (1-7)
        '0398765432',   // 7 descending digits (9-3)
      ];

      validNumbers.forEach(number => {
        expect(isValidJpnPhoneNumber(number)).toBe(true);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(isValidJpnPhoneNumber('')).toBe(false);
    });

    it('should handle single digit', () => {
      expect(isValidJpnPhoneNumber('0')).toBe(false);
    });

    it('should handle very long numbers', () => {
      expect(isValidJpnPhoneNumber('0123456789012345')).toBe(false);
    });

    it('should handle mixed valid/invalid patterns', () => {
      // Numbers that pass some checks but fail others
      expect(isValidJpnPhoneNumber('1234567890')).toBe(false); // 10 digits but doesn't start with 0
      expect(isValidJpnPhoneNumber('0012345678')).toBe(false); // Starts with 0 but also with 00
    });
  });
});

describe('isTooSequential helper function', () => {
  describe('Ascending sequences (direction = 1)', () => {
    it('should detect sequences longer than max allowed', () => {
      expect(isTooSequential('01234567', 6, 1)).toBe(true);
      expect(isTooSequential('12345678', 6, 1)).toBe(true);
      expect(isTooSequential('01234567890', 7, 1)).toBe(true);
    });

    it('should allow sequences within max allowed', () => {
      expect(isTooSequential('0123456', 6, 1)).toBe(false);
      expect(isTooSequential('01234567', 7, 1)).toBe(false);
      expect(isTooSequential('012345', 6, 1)).toBe(false);
    });

    it('should handle non-sequential numbers', () => {
      expect(isTooSequential('0135792468', 6, 1)).toBe(false);
      expect(isTooSequential('0123456890', 6, 1)).toBe(false);
    });
  });

  describe('Descending sequences (direction = -1)', () => {
    it('should detect sequences longer than max allowed', () => {
      expect(isTooSequential('87654321', 6, -1)).toBe(true);
      expect(isTooSequential('9876543210', 7, -1)).toBe(true);
      expect(isTooSequential('098765432', 6, -1)).toBe(true);
    });

    it('should allow sequences within max allowed', () => {
      expect(isTooSequential('8765432', 6, -1)).toBe(false);
      expect(isTooSequential('987654', 6, -1)).toBe(false);
      expect(isTooSequential('09876543', 7, -1)).toBe(false);
    });

    it('should handle non-sequential numbers', () => {
      expect(isTooSequential('0864209753', 6, -1)).toBe(false);
      expect(isTooSequential('9876543012', 6, -1)).toBe(false);
    });
  });

  describe('Edge cases for isTooSequential', () => {
    it('should handle single character', () => {
      expect(isTooSequential('0', 5, 1)).toBe(false);
      expect(isTooSequential('9', 5, -1)).toBe(false);
    });

    it('should handle two characters', () => {
      expect(isTooSequential('01', 5, 1)).toBe(false);
      expect(isTooSequential('98', 5, -1)).toBe(false);
    });

    it('should handle sequences that wrap around', () => {
      expect(isTooSequential('9012345', 5, 1)).toBe(false); // 9->0 is not sequential
      expect(isTooSequential('0987654', 5, -1)).toBe(false); // 0->9 is not sequential
    });
  });
});