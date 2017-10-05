# -*- coding: utf-8 -*-
'''test for util.py'''
import unittest
import util
# from .. import util
# from util import get_cv

class Test(unittest.TestCase):
    rafsis = (
        ("a'u", "V'V"),
        ('bajyjvi', 'CVCYCCV'),
        ('brode', 'CCVCV'),
        ('brife', 'CCVCV'),
        ("noltruti'u", "CVCCCVCV'V"),
        ('inaja', 'VCVCV'),
        ('selci', 'CVCCV'),
        ('tcini', 'CCVCV'),
        ('toi', 'CVV'),
        ('uenai', 'VVCVV'),
        ("pe'o", "CV'V")
    )
    def test_get_cv(self):
        for rafsi, data_cv in self.rafsis:
            result = util.get_cv(rafsi)
            self.assertEqual(result, data_cv)
            result = util.get_cv(rafsi, False)
            self.assertEqual(result, data_cv.replace("'", ''))
            self.assertRaises(ValueError, util.get_cv, 'dfha')

    def test_permissible_c(self):
        for rafsi, data_cv in self.rafsis:
            self.assertEqual(util.permissible_c('gf'), 0)
            self.assertEqual(util.permissible_c('ts'), 2)
            self.assertEqual(util.permissible_c('dl'), 1)

if __name__ == '__main__':
    unittest.main()
